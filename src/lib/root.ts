import '#commands/_load';

import type { Logger } from '@skyra/logger';
import type { Options } from 'commander';
import type { CommandStore } from '#lib/structures/CommandStore';

export default {};

declare module '@sapphire/pieces' {
	interface Container {
		logger: Logger;
		options: Options;
	}

	interface StoreRegistryEntries {
		commands: CommandStore;
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		APPLICATION_ID: string;
		DISCORD_TOKEN: string;
	}
}

declare module 'commander' {
	export interface Options {
		applicationId: string;
		token: string;
		verbose: boolean;
	}
}
