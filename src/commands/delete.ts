import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { Command } from '#lib/structures/Command';

type Args = [['id', Snowflake]];

export class DeleteEmoji extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Deletes an emoji from the server',
			arguments: [
				{
					name: 'id',
					description: 'The id of the emoji to get'
				}
			]
		});
	}

	public override run({ args }: Command.Run<Args>) {
		throw new Error(`Method not implemented. id=${args.id}`);
	}
}

void container.stores.loadPiece({
	name: 'delete',
	piece: DeleteEmoji,
	store: 'commands'
});
