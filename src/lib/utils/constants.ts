import { readFile } from 'node:fs/promises';
import { platform, release } from 'node:os';
import { URL } from 'node:url';
import { FetchMediaContentTypes } from '@sapphire/fetch';

const cliRootDir = new URL('../../../', import.meta.url);
const packageFile = new URL('package.json', cliRootDir);
export const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));

export const DiscordRequestHeaders = {
	'User-Agent': `Favware Discord Application Emoji Manager/${packageJson.version} (undici) ${platform()}/${release()} (https://github.com/favware/discord-application-emoji-manager/tree/main)`,
	Accept: FetchMediaContentTypes.JSON
};
