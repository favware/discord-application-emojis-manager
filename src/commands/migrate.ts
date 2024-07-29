import { Buffer } from 'node:buffer';
import { exit } from 'node:process';
import { Transformer } from '@napi-rs/image';
import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { CDNRoutes, ImageFormat, RouteBases, Routes, type APIEmoji } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checkIdIsInArgs } from '#lib/utils/checks';
import { handleError } from '#lib/utils/error-handler';
import { getCurrentEmojis } from '#lib/utils/get-current-emojis';

type Args = [['id', Snowflake]];

interface Emoji {
	animated?: boolean;
	name: string;
}

interface EmojiWithUrl extends Emoji {
	url: string;
}

interface EmojiWithBase64 extends Emoji {
	base64: string;
}

export class MigrateEmojis extends Command<Args> {
	#skippedCount = 0;

	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Migrates the emojis from a specified server to the application',
			arguments: [
				{
					name: 'id',
					description:
						'The id of the server to migrate the emojis from. Unlike other commands names are not supported, because server names cannot be guaranteed to be unique.'
				}
			]
		});
	}

	public override async run({ args, options }: Command.Run<Args>) {
		checkIdIsInArgs(args.id);

		const guildEmojis = await this.getGuildEmojis(args.id);
		if (!guildEmojis?.length) return this.handleNoGuildEmojis(args.id);

		const currentEmojis = await getCurrentEmojis(options);
		const currentEmojiNames = currentEmojis.map((emoji) => emoji.name);

		const filteredEmojis = guildEmojis.filter((emoji) => {
			const isCurrentEmoji = currentEmojiNames.includes(emoji.name ?? '');
			if (isCurrentEmoji) {
				this.#skippedCount++;
				this.container.logger.warn(`Skipping emoji "${emoji.name}" your application already has emojis with that name`);
				return false;
			}

			return !isCurrentEmoji;
		});

		if (!filteredEmojis.length) return this.handleNoFilteredEmojis();

		const emojiNamesAndUrls = filteredEmojis.map<EmojiWithUrl>((emoji) => ({
			name: emoji.name!,
			animated: emoji.animated,
			url: `${RouteBases.cdn}${CDNRoutes.emoji(emoji.id!, emoji.animated ? ImageFormat.GIF : ImageFormat.PNG)}?size=4096&quality=lossless`
		}));

		const emojisToUpload = await this.getEmojiBase64s(emojiNamesAndUrls);

		const promises: Promise<APIEmoji>[] = [];

		for (const emojiToUpload of emojisToUpload ?? []) {
			this.container.logger.info(`Queueing emoji "${emojiToUpload.name}" for uploading`);

			promises.push(
				this.container.rest.post(Routes.applicationEmojis(options.applicationId), {
					body: {
						name: emojiToUpload.name,
						image: emojiToUpload.base64
					}
				}) as Promise<APIEmoji>
			);
		}

		try {
			await Promise.all(promises);

			if (this.#skippedCount === guildEmojis.length) {
				this.container.logger.warn('No new emojis were uploaded');
			} else {
				this.container.logger.info('Uploaded all emoji successfully');
			}
		} catch (error) {
			handleError(error as Error);
		}
	}

	private async getGuildEmojis(id: string): Promise<APIEmoji[] | undefined> {
		try {
			const data = await this.container.rest.get(Routes.guildEmojis(id));
			return data as APIEmoji[];
		} catch (error) {
			handleError(error as Error);
			return undefined;
		}
	}

	private async getEmojiBase64s(emojis: EmojiWithUrl[]): Promise<EmojiWithBase64[] | undefined> {
		const emojisWithBase64: EmojiWithBase64[] = [];

		try {
			for (const emoji of emojis) {
				const mimeType = emoji.animated ? 'image/gif' : 'image/png';

				const buffer = await fetch(emoji.url)
					.then(async (response) => response.blob())
					.then(async (blob) => blob.arrayBuffer())
					.then((blob) => Buffer.from(blob));

				if (buffer.byteLength <= MigrateEmojis.MaximumUploadSize) {
					const imageBase64 = Buffer.from(buffer).toString('base64');

					emojisWithBase64.push({ name: emoji.name, base64: `data:${mimeType};base64,${imageBase64}` });
				} else {
					if (emoji.animated) {
						this.#skippedCount++;
						this.skipEmojiForSize(emoji.name);
						continue;
					}

					const image = await new Transformer(buffer).fastResize({ width: 128, height: 128, fit: 2 }).png();

					if (image.byteLength > MigrateEmojis.MaximumUploadSize) {
						this.#skippedCount++;
						this.skipEmojiForSize(emoji.name);
						continue;
					}

					const imageBase64 = Buffer.from(image).toString('base64');
					emojisWithBase64.push({ name: emoji.name, base64: `data:${mimeType};base64,${imageBase64}` });
				}
			}

			return emojisWithBase64;
		} catch {
			this.container.logger.fatal(`Failed to retrieve the emojis from the server from the Discord CDN`);
			return exit(1);
		}
	}

	private handleNoGuildEmojis(id: string) {
		this.container.logger.fatal(`The server with id ${id} has no emojis.`);
		return exit(1);
	}

	private handleNoFilteredEmojis() {
		this.container.logger.warn('Your application already has all the emojis from the server, or there are no emojis with unique names.');
		return exit(1);
	}

	private skipEmojiForSize(emojiName: string) {
		this.container.logger.warn(`Skipping emoji "${emojiName}" because it is larger than 256 KiB`);
	}

	private static readonly MaximumUploadSize = 256 * 1_024;
}

void container.stores.loadPiece({
	name: 'migrate',
	piece: MigrateEmojis,
	store: 'commands'
});
