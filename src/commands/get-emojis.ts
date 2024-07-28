import { container } from '@sapphire/pieces';
import { ApplyOptions } from '#lib/decorators/apply-options';
import { Command } from '#lib/structures/Command';

@ApplyOptions<Command.Options>({
	description: 'Gets all emojis from the server in JSON format'
})
export class GetEmojis extends Command<never> {
	public override run() {
		throw new Error(`Method not implemented.`);
	}
}

void container.stores.loadPiece({
	name: 'get-emojis',
	piece: GetEmojis,
	store: 'commands'
});
