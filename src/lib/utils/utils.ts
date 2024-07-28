import type { Options } from 'commander';

export function getToken(options: Options): string {
	return `Bot ${options.token}`;
}
