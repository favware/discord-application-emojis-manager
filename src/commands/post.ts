import { container } from '@sapphire/pieces';
import { Command } from '#lib/structures/Command';

type Args = [['path', string]];

export class PostEmojis extends Command<Args> {
	public constructor(context: Command.LoaderContext) {
		super(context, {
			description: 'Posts all emoji in the input directory to the server',
			arguments: [
				{
					name: 'path',
					description: 'The file path to the directory containing the emojis, can be relative to the current working directory or absolute.'
				}
			]
		});
	}

	public override run({ args }: Command.Run<Args>) {
		throw new Error(`Method not implemented. path=${args.path}`);
	}
}

void container.stores.loadPiece({
	name: 'post',
	piece: PostEmojis,
	store: 'commands'
});
