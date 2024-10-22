import { Buffer } from 'node:buffer';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, extname, isAbsolute, join } from 'node:path';
import { cwd, exit } from 'node:process';
import { Transformer } from '@napi-rs/image';
import { findFilesRecursivelyRegex } from '@sapphire/node-utilities';
import { container } from '@sapphire/pieces';
import { type APIEmoji, Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checkPathIsInArgs } from '#lib/utils/checks';
import { validImageExtensions } from '#lib/utils/constants';
import { handleError } from '#lib/utils/error-handler';
import { getCurrentEmojis } from '#lib/utils/get-current-emojis';

type Args = [['path', string]];

export class PostEmojis extends Command<Args> {
	#skippedCount = 0;

	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Posts all emoji in the input directory to the bot application',
			arguments: [
				{
					name: 'path',
					description: 'The file path to the directory containing the emojis, can be relative to the current working directory or absolute.'
				}
			]
		});
	}

	public override async run({ args, options }: Command.Run<Args>) {
		checkPathIsInArgs(args.path);

		const imagesPath = isAbsolute(args.path) ? args.path : join(cwd(), args.path);
		this.container.logger.debug(imagesPath);

		if (!existsSync(imagesPath)) {
			this.container.logger.fatal(`The path you provided to the images (${imagesPath}) does not exist.`);
			exit(1);
		}

		const promises: Promise<APIEmoji>[] = [];
		const currentEmojis = await getCurrentEmojis(options);
		let filesCount = 0;

		for await (const file of findFilesRecursivelyRegex(imagesPath, validImageExtensions)) {
			filesCount++;

			const extension = extname(file);
			const name = basename(file);
			const nameWithoutExtension = basename(file, extension);

			if (currentEmojis.some((emoji) => emoji.name === nameWithoutExtension)) {
				this.container.logger.warn(`Skipping emoji "${name}" because an emoji with that name already exists`);
				this.#skippedCount++;
				continue;
			}

			const mimeType = this.extensionToMimeType(extension);
			const image = await this.getFile(file, name, mimeType);

			if (image) {
				this.container.logger.info(`Queueing emoji "${nameWithoutExtension}" for uploading`);

				promises.push(
					this.container.rest.post(Routes.applicationEmojis(options.applicationId), {
						body: {
							name: nameWithoutExtension,
							image
						}
					}) as Promise<APIEmoji>
				);
			}
		}

		try {
			await Promise.all(promises);

			if (this.#skippedCount === filesCount) {
				this.container.logger.warn('No new emojis were uploaded');
			} else {
				this.container.logger.info('Uploaded all emoji successfully');
			}
		} catch (error) {
			handleError(error as Error);
		}
	}

	private async getFile(file: string, name: string, mimeType: 'image/gif' | 'image/jpeg' | 'image/png'): Promise<string | undefined> {
		const buffer = await this.readImageFile(file);

		if (buffer.byteLength <= PostEmojis.MaximumUploadSize) {
			const imageBase64 = Buffer.from(buffer).toString('base64');
			return `data:${mimeType};base64,${imageBase64}`;
		} else if (mimeType === 'image/gif') {
			this.#skippedCount++;
			this.skipEmojiForSize(name);
			return undefined;
		} else {
			const image = await new Transformer(buffer).fastResize({ width: 128, height: 128, fit: 2 }).png();

			if (image.byteLength > PostEmojis.MaximumUploadSize) {
				this.#skippedCount++;
				this.skipEmojiForSize(name);
				return undefined;
			}

			const imageBase64 = Buffer.from(buffer).toString('base64');
			return `data:${mimeType};base64,${imageBase64}`;
		}
	}

	private async readImageFile(file: string): Promise<Buffer> {
		try {
			return await readFile(file);
		} catch {
			this.container.logger.fatal(`Failed to read image file ${file}`);
			exit(1);
		}
	}

	private extensionToMimeType(extension: string) {
		switch (extension) {
			case '.png':
				return 'image/png';
			case '.jpg':
			case '.jpeg':
				return 'image/jpeg';
			case '.gif':
				return 'image/gif';
			default:
				this.container.logger.fatal('Unsupported file extension detected in the images directory, please validate the files.');
				exit(1);
		}
	}

	private skipEmojiForSize(emojiName: string) {
		this.container.logger.warn(`Skipping emoji "${emojiName}" because it is larger than 256 KiB`);
	}

	private static readonly MaximumUploadSize = 256 * 1_024;
}

void container.stores.loadPiece({
	name: 'post',
	piece: PostEmojis,
	store: 'commands'
});
