import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checksNameOrIdIsInArgs } from '#lib/utils/checks';
import { handleError } from '#lib/utils/error-handler';
import { getIdForPossibleName } from '#lib/utils/get-current-emoji-names';

type Args = [['nameOrId', Snowflake]];

export class DeleteEmoji extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Deletes an emoji from the server',
			arguments: [
				{
					name: 'nameOrId',
					description:
						'The name or snowflake of the emoji to delete. If a name is provided a list of emojis will be fetched to find the id to delete.'
				}
			]
		});
	}

	public override async run({ args, options }: Command.Run<Args>) {
		checksNameOrIdIsInArgs('get', args.nameOrId);

		const emojiId = await getIdForPossibleName(args.nameOrId, options);

		try {
			await this.container.rest.delete(Routes.applicationEmoji(options.applicationId, emojiId));

			this.container.logger.info(`Deleted emoji ${args.nameOrId} successfully`);
		} catch (error) {
			handleError(error as Error);
		}
	}
}

void container.stores.loadPiece({
	name: 'delete',
	piece: DeleteEmoji,
	store: 'commands'
});
