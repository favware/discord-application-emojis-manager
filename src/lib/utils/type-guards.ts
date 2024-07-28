import type { Options } from 'commander';

export function isOptionsObject(possibleOptions: unknown): possibleOptions is Options {
	return (
		typeof possibleOptions === 'object' &&
		possibleOptions !== null &&
		'token' in possibleOptions &&
		'applicationId' in possibleOptions &&
		'verbose' in possibleOptions
	);
}
