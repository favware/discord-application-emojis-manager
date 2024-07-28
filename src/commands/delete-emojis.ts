import { container } from '@sapphire/pieces';
import { ApplyOptions } from '#lib/decorators/apply-options';
import { Command } from '#lib/structures/Command';

@ApplyOptions<Command.Options>({
	description: 'Deletes all emoji from the server'
})
export class DeleteEmojis extends Command<never> {
	public override run() {
		throw new Error('Method not implemented.');
	}
}

void container.stores.loadPiece({
	name: 'delete-emojis',
	piece: DeleteEmojis,
	store: 'commands'
});
