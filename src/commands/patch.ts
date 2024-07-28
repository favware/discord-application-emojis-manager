import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checksNameOrIdIsInArgs } from '#lib/utils/checks';
import { handleError } from '#lib/utils/error-handler';
import { getIdForPossibleName } from '#lib/utils/get-current-emoji-names';

type Args = [['nameOrId', Snowflake], ['name', string]];

export class PatchEmoji extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Patches an emoji on the server provided the emoji id and a new name for the emoji',
			arguments: [
				{
					name: 'nameOrId',
					description:
						'The name or snowflake of the emoji to update. If a name is provided a list of emojis will be fetched to find the id to update.'
				},
				{
					name: 'name',
					description: 'The new name for the emoji'
				}
			]
		});
	}

	public override async run({ args, options }: Command.Run<Args>) {
		checksNameOrIdIsInArgs('get', args.nameOrId);

		const emojiId = await getIdForPossibleName(args.nameOrId, options);

		try {
			const response = await this.container.rest.patch(Routes.applicationEmoji(options.applicationId, emojiId), {
				body: {
					name: args.name
				}
			});

			this.container.logger.info(`Updated emoji:`);
			console.log(JSON.stringify(response, null, 4));
		} catch (error) {
			handleError(error as Error);
		}
	}
}

void container.stores.loadPiece({
	name: 'patch',
	piece: PatchEmoji,
	store: 'commands'
});
