#!/usr/bin/env node

import '#lib/root';

import process from 'node:process';
import { container } from '@sapphire/pieces';
import { Command as CommanderCommand } from 'commander';
import { CommandStore } from '#lib/structures/CommandStore';
import packageJson from '../package.json' with { type: 'json' };

container.stores.register(new CommandStore());

await container.stores.get('commands').loadAll();

const commanderCommands: CommanderCommand[] = [];

for (const command of container.stores.get('commands').values()) {
	commanderCommands.push(
		new CommanderCommand().command(command.name.split('-').at(-1)!).description(command.description).action(command.run.bind(command))
	);
}

const command = new CommanderCommand() //
	.version(packageJson.version);

for (const commanderCommand of commanderCommands) {
	command.addCommand(commanderCommand);
}

command.parse(process.argv);

process.exit(0);
