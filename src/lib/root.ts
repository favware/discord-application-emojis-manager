import type { CommandStore } from '#lib/structures/CommandStore';

import '#commands/_load';

export default {};

declare module '@sapphire/pieces' {
	interface StoreRegistryEntries {
		commands: CommandStore;
	}
}
