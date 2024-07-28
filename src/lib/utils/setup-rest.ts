import { REST } from '@discordjs/rest';
import { container } from '@sapphire/pieces';
import type { Options } from 'commander';

export function setupREST(options: Options) {
	const rest = new REST({ version: '10', authPrefix: 'Bot' }).setToken(options.token);
	container.rest = rest;
}
