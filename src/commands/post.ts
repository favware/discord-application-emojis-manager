// @ts-nocheck asd
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, extname, isAbsolute, join } from 'node:path';
import { cwd, exit } from 'node:process';
import { fetch, FetchMediaContentTypes, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { findFilesRecursivelyRegex } from '@sapphire/node-utilities';
import { container } from '@sapphire/pieces';
import { type APIEmoji, RouteBases, Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checkPathIsInArgs } from '#lib/utils/checks';
import { DiscordRequestHeaders, IMAGE_EXTENSION } from '#lib/utils/constants';
import { getToken } from '#lib/utils/utils';

type Args = [['path', string]];

export class PostEmojis extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Posts all emoji in the input directory to the server',
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

		for await (const file of findFilesRecursivelyRegex(imagesPath, IMAGE_EXTENSION)) {
			const extension = extname(file);
			const name = basename(file, extension);
			this.container.logger.debug(`Uploading emoji ${name}`);

			const mimeType = this.extensionToMimeType(extension);
			const imageBase64 = await this.readImageFile(file);
			const image = `data:${mimeType};base64,${imageBase64}`;

			promises.push(
				fetch<APIEmoji>(
					RouteBases.api + Routes.applicationEmojis(options.applicationId),
					{
						method: FetchMethods.Post,
						body: JSON.stringify({
							name,
							image
						}),
						headers: {
							...DiscordRequestHeaders,
							'Content-Type': FetchMediaContentTypes.JSON,
							Authorization: getToken(options)
						}
					},
					FetchResultTypes.JSON
				)
			);
		}

		await Promise.all(promises);
	}

	private async readImageFile(file: string): Promise<string> {
		try {
			return await readFile(file, 'base64');
		} catch {
			this.container.logger.fatal(`Failed to read image file ${file}`);
			exit(1);
		}
	}

	private extensionToMimeType(extension: string) {
		switch (extension) {
			case '.png':
				return FetchMediaContentTypes.ImagePNG;
			case '.jpg':
			case '.jpeg':
				return FetchMediaContentTypes.ImageJPEG;
			case '.gif':
				return FetchMediaContentTypes.ImageGIF;
			default:
				this.container.logger.fatal('Unsupported file extension detected in the images directory, please validate the files.');
				exit(1);
		}
	}
}

void container.stores.loadPiece({
	name: 'post',
	piece: PostEmojis,
	store: 'commands'
});
