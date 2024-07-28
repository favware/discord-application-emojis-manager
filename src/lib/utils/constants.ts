import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const cliRootDir = new URL('../../../', import.meta.url);
const packageFile = new URL('package.json', cliRootDir);
export const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));

/**
 * Image extensions:
 * - jpg
 * - jpeg
 * - png
 * - gif
 */
export const validImageExtensions = /\.(?<extension>jpe?g|png|gif)$/i;
