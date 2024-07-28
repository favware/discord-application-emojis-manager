import { container } from '@sapphire/pieces';
import { ApplyOptions } from '#lib/decorators/apply-options';
import { Command } from '#lib/structures/Command';

@ApplyOptions<Command.Options>({
	description: 'Posts all emoji in the input directory to the server'
})
export class PostEmojis extends Command<never> {
	public override run() {
		throw new Error('Method not implemented.');
	}
}

void container.stores.loadPiece({
	name: 'post-emojis',
	piece: PostEmojis,
	store: 'commands'
});
