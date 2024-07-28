import { container } from '@sapphire/pieces';
import { Command } from '#lib/structures/Command';

export class ListEmojis extends Command<never> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Lists all emojis from the server in JSON format'
		});
	}

	public override run() {
		throw new Error(`Method not implemented.`);
	}
}

void container.stores.loadPiece({
	name: 'list',
	piece: ListEmojis,
	store: 'commands'
});
