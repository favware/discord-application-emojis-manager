import { container } from '@sapphire/pieces';
import { Command } from '#lib/structures/Command';

export class DeleteEmojis extends Command<never> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Deletes all emoji from the server'
		});
	}

	public override run() {
		throw new Error('Method not implemented.');
	}
}

void container.stores.loadPiece({
	name: 'delete-all',
	piece: DeleteEmojis,
	store: 'commands'
});
