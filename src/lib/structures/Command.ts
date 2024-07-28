import { Piece } from '@sapphire/pieces';

export abstract class Command<Args, Options extends Command.Options = Command.Options> extends Piece<Options, 'commands'> {
	/**
	 * A basic summary about the command
	 */
	public description: string;

	/**
	 * @param context - context The context.
	 * @param options - options Optional Command settings.
	 */
	public constructor(context: Piece.LoaderContext, options: CommandOptions = {} as CommandOptions) {
		const name = options.name ?? context.name;
		super(context, { ...options, name: name.toLowerCase() });

		this.description = options.description ?? '';
	}

	/**
	 * The main method to be run when the command is called.
	 *
	 * @param args - The arguments, if any.
	 */
	public abstract run(...args: Args[]): Promise<void> | void;
}

/**
 * The {@link Command} options.
 */
export interface CommandOptions extends Piece.Options {
	/**
	 * The description for the command.
	 */
	description?: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Command {
	export type Options = CommandOptions;
	export type LoaderContext = Piece.LoaderContext<'commands'>;
}
