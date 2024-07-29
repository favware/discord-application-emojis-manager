import { Buffer } from 'node:buffer';
import { exit } from 'node:process';
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
				this.container.logger.info(`Skipping emoji "${emoji.name}" your application already has emojis with that name`);
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
		if (!emojisToUpload?.length) return this.handleNoEmojiBase64s();

		const promises: Promise<APIEmoji>[] = [];

		for (const emojiToUpload of emojisToUpload) {
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

			this.container.logger.info('Uploaded emoji successfully');
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
				const response = await fetch(emoji.url);
				const buffer = await response.arrayBuffer();
				const maxBufferSize = 256 * 1_024; // 256 KiB
				if (buffer.byteLength > maxBufferSize) {
					this.container.logger.info(`Skipping emoji "${emoji.name}" because it is larger than 256 KiB`);
					continue;
				}

				const mimeType = emoji.animated ? 'image/gif' : 'image/png';
				const imageBase64 = Buffer.from(buffer).toString('base64');

				emojisWithBase64.push({ name: emoji.name, base64: `data:${mimeType};base64,${imageBase64}` });
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
		this.container.logger.info('Your application already has all the emojis from the server, or there are no emojis with unique names.');
		return exit(1);
	}

	private handleNoEmojiBase64s() {
		this.container.logger.fatal(
			"There are no emojis left to upload. Either they were all skipped or there was an error downloading them. You can check if the Discord CDN works, if it does then it's the first reason."
		);
		return exit(1);
	}
}

void container.stores.loadPiece({
	name: 'migrate',
	piece: MigrateEmojis,
	store: 'commands'
});
