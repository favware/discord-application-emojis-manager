import process from 'node:process';
import { container } from '@sapphire/pieces';
import type { Options } from 'commander';

export function checkOptions(options: Options): void {
	if (!options.applicationId) {
		container.logger.fatal(
			'Application ID is required, provide it through the --application-id flag or the APPLICATION_ID environment variable.'
		);
		process.exit(1);
	}

	if (!options.token) {
		container.logger.fatal('Token is required, provide it through the --token flag or the DISCORD_TOKEN environment variable.');
		process.exit(1);
	}
}
