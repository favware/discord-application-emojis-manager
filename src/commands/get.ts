import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { Routes } from 'discord-api-types/v10';
import { Command } from '#lib/structures/Command';
import { checksNameOrIdIsInArgs } from '#lib/utils/checks';
import { handleError } from '#lib/utils/error-handler';
import { getIdForPossibleName } from '#lib/utils/get-current-emojis';
import { stringify } from '#lib/utils/stringify';

type Args = [['nameOrId', Snowflake]];

export class GetEmojis extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Gets a single emojis from the bot application in JSON format',
			arguments: [
				{
					name: 'nameOrId',
					description:
						'The name or snowflake of the emoji to get. If a name is provided a list of emojis will be fetched to find the id to get.'
				}
			]
		});
	}

	public override async run({ args, options }: Command.Run<Args>) {
		checksNameOrIdIsInArgs('get', args.nameOrId);

		const emojiId = await getIdForPossibleName(args.nameOrId, options);

		try {
			const response = await this.container.rest.get(Routes.applicationEmoji(options.applicationId, emojiId));

			this.container.logger.info(`Requested emoji data:`);
			console.log(stringify(response));
		} catch (error) {
			handleError(error as Error);
		}
	}
}

void container.stores.loadPiece({
	name: 'get',
	piece: GetEmojis,
	store: 'commands'
});
