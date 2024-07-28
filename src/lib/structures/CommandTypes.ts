import type { Piece } from '@sapphire/pieces';
import type { OptionValues } from 'commander';

export interface CommandRunParameters<Args extends [string, unknown][]> {
	/**
	 * The arguments, if any.
	 */
	args: Record<Args[number][0], Args[number][1]>;

	/**
	 * The options, if any.
	 */
	options: OptionValues;
}

/**
 * Represents an argument for a command.
 */
export interface CommandArgument<KeyName extends string> {
	/**
	 * The description of the argument.
	 */
	description: string;

	/**
	 * The name of the argument.
	 */
	name: KeyName;
}

/**
 * The Command options.
 */
export interface CommandOptions<Args extends [string, unknown][]> extends Piece.Options {
	/**
	 * The arguments for the command.
	 */
	arguments?: CommandArgument<Args[number][0]>[];

	/**
	 * The description for the command.
	 */
	description?: string;
}
