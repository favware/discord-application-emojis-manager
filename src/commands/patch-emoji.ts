import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { ApplyOptions } from '#lib/decorators/apply-options';
import { Command } from '#lib/structures/Command';

@ApplyOptions<Command.Options>({
	description: 'Patches an emoji on the server provided the emoji id and a new name for the emoji'
})
export class PatchEmoji extends Command<[Snowflake, string]> {
	public override run([id, name]: [Snowflake, string]) {
		throw new Error(`Method not implemented. id=${id}, name=${name}`);
	}
}

void container.stores.loadPiece({
	name: 'patch-emoji',
	piece: PatchEmoji,
	store: 'commands'
});
