import '#commands/_load';

import type { REST } from '@discordjs/rest';
import type { Logger } from '@skyra/logger';
import type { CommandStore } from '#lib/structures/CommandStore';

export default {};

declare module '@sapphire/pieces' {
	interface Container {
		logger: Logger;
		rest: REST;
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
