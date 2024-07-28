import { container } from '@sapphire/pieces';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import type { CommandRunParameters } from '#lib/structures/CommandTypes';
import { handleError } from '#lib/utils/error-handler';

export class ListEmojis extends Command<never> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Lists all emojis from the server in JSON format'
		});
	}

	public override async run({ options }: CommandRunParameters<never>) {
		try {
			const response = await this.container.rest.get(Routes.applicationEmojis(options.applicationId));

			this.container.logger.info(`Commands registered for application ${options.applicationId}:`);
			console.log(JSON.stringify(response, null, 4));
		} catch (error) {
			handleError(error as Error);
		}
	}
}

void container.stores.loadPiece({
	name: 'list',
	piece: ListEmojis,
	store: 'commands'
});
