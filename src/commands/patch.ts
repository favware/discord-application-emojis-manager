import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { Command } from '#lib/structures/Command';

type Args = [['id', Snowflake], ['name', string]];

export class PatchEmoji extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Patches an emoji on the server provided the emoji id and a new name for the emoji',
			arguments: [
				{
					name: 'id',
					description: 'The id of the emoji to patch'
				},
				{
					name: 'name',
					description: 'The new name for the emoji'
				}
			]
		});
	}

	public override run({ args }: Command.Run<Args>) {
		throw new Error(`Method not implemented. id=${args.id}, name=${args.name}`);
	}
}

void container.stores.loadPiece({
	name: 'patch',
	piece: PatchEmoji,
	store: 'commands'
});
