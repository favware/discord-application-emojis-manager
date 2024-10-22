import { container } from '@sapphire/pieces';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { handleError } from '#lib/utils/error-handler';
import { getCurrentEmojis } from '#lib/utils/get-current-emojis';

export class DeleteEmojis extends Command<never> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Deletes all emoji from the bot application'
		});
	}

	public override async run({ options }: Command.Run<never>) {
		const currentEmojis = await getCurrentEmojis(options);

		const promises: Promise<unknown>[] = [];

		for (const emoji of currentEmojis) {
			promises.push(this.container.rest.delete(Routes.applicationEmoji(options.applicationId, emoji.id)));
		}

		try {
			await Promise.all(promises);
			this.container.logger.info(`Deleted all emoji successfully`);
		} catch (error) {
			handleError(error as Error);
		}
	}
}

void container.stores.loadPiece({
	name: 'delete-all',
	piece: DeleteEmojis,
	store: 'commands'
});
