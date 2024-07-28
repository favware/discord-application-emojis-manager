import { Piece } from '@sapphire/pieces';
import type { CommandOptions, CommandArgument, CommandRunParameters } from '#lib/structures/CommandTypes';

export abstract class Command<Args extends [string, unknown][], Options extends Command.Options<Args> = Command.Options<Args>> extends Piece<
	Options,
	'commands'
> {
	/**
	 * A basic summary about the command
	 */
	public description: string;

	public arguments: CommandArgument<Args[number][0]>[];

	/**
	 * @param context - context The context.
	 * @param options - options Optional Command settings.
	 */
	public constructor(context: Piece.LoaderContext, options: CommandOptions<Args> = {} as CommandOptions<Args>) {
		const name = options.name ?? context.name;
		super(context, { ...options, name: name.toLowerCase() });

		this.description = options.description ?? '';
		this.arguments = options.arguments ?? [];
	}

	/**
	 * The main method to be run when the command is called.
	 *
	 * @param args - The arguments, if any.
	 */
	public abstract run(parameters: CommandRunParameters<Args>): Promise<void> | void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Command {
	export type Options<Args extends [string, unknown][]> = CommandOptions<Args>;
	export type LoaderContext = Piece.LoaderContext<'commands'>;
	export type Run<Args extends [string, unknown][]> = CommandRunParameters<Args>;
}
