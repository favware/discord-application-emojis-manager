import { container } from '@sapphire/pieces';
import type { Snowflake } from 'discord-api-types/globals';
import { ApplyOptions } from '#lib/decorators/apply-options';
import { Command } from '#lib/structures/Command';

@ApplyOptions<Command.Options>({
	description: 'Deletes an emoji from the server'
})
export class DeleteEmoji extends Command<Snowflake> {
	public override run(id: Snowflake) {
		throw new Error(`Method not implemented. id=${id}`);
	}
}

void container.stores.loadPiece({
	name: 'delete-emoji',
	piece: DeleteEmoji,
	store: 'commands'
});
