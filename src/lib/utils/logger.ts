import { container } from '@sapphire/pieces';
import { Logger } from '@skyra/logger';
import type { CommandRunParameters } from '#lib/structures/CommandTypes';

export function setupLoggerAndLogOptions<Args extends [string, unknown][]>(runArgs: CommandRunParameters<Args>) {
	const logger = new Logger({ level: runArgs.options.verbose ? Logger.Level.Debug : Logger.Level.Info });

	container.logger = logger;

	container.logger.debug('resolved options: ', JSON.stringify(runArgs, null, 2));
}
