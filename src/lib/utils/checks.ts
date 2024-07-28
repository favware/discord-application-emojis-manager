import { exit } from 'node:process';
import { container } from '@sapphire/pieces';
import type { Options } from 'commander';

export function checkOptions(options: Options) {
	if (!options.applicationId) {
		container.logger.fatal(
			'Application ID is required, provide it through the --application-id flag or the APPLICATION_ID environment variable.'
		);
		exit(1);
	}

	if (!options.token) {
		container.logger.fatal('Token is required, provide it through the --token flag or the DISCORD_TOKEN environment variable.');
		exit(1);
	}
}

export function checksIdIsInArgs(variant: 'delete' | 'get' | 'update', id?: string) {
	if (!id) {
		container.logger.fatal(`A Command ID to ${variant} is required.`);
		exit(1);
	}
}

export function checkPathIsInArgs(path?: string) {
	if (!path) {
		container.logger.fatal(
			'A path to the directory containing the emojis is required, can be relative to the current working directory or absolute.'
		);
		exit(1);
	}
}
