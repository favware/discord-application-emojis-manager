import type { OptionValues } from 'commander';

export function isOptionsObject(possibleOptions: unknown): possibleOptions is OptionValues {
	return (
		typeof possibleOptions === 'object' &&
		possibleOptions !== null &&
		'token' in possibleOptions &&
		'applicationId' in possibleOptions &&
		'verbose' in possibleOptions
	);
}
