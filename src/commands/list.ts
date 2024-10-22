import { container } from '@sapphire/pieces';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import type { CommandRunParameters } from '#lib/structures/CommandTypes';
import { handleError } from '#lib/utils/error-handler';
import { stringify } from '#lib/utils/stringify';

export class ListEmojis extends Command<never> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Lists all emojis from the bot application in JSON format'
		});
	}

	public override async run({ options }: CommandRunParameters<never>) {
		try {
			const response = await this.container.rest.get(Routes.applicationEmojis(options.applicationId));

			this.container.logger.info(`Emojis registered for application ${options.applicationId}:`);
			console.log(stringify(response));
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
