import { SnowflakeRegex } from '@sapphire/discord-utilities';
import { container } from '@sapphire/pieces';
import type { Options } from 'commander';
import { type RESTGetAPIApplicationEmojisResult, Routes, type Snowflake } from 'discord-api-types/v10';
import { handleError } from '#lib/utils/error-handler';

export async function getCurrentEmojis(options: Options): Promise<{ id: string; name: string }[]> {
	let currentEmojis: RESTGetAPIApplicationEmojisResult | null = null;

	try {
		currentEmojis = (await container.rest.get(Routes.applicationEmojis(options.applicationId))) as RESTGetAPIApplicationEmojisResult;
	} catch (error) {
		handleError(error as Error);
	}

	if (!currentEmojis) return [];

	return currentEmojis.items.map((emoji) => ({ name: emoji.name!, id: emoji.id! }));
}

export async function getIdForPossibleName(nameOrId: Snowflake, options: Options): Promise<string> {
	let emojiId = nameOrId;

	// Check if a name or id was provided
	if (!SnowflakeRegex.test(nameOrId)) {
		const currentEmojis = await getCurrentEmojis(options);
		const currentEmoji = currentEmojis.find((emoji) => emoji.name === nameOrId);

		if (currentEmoji) {
			emojiId = currentEmoji.id;
		}
	}

	return emojiId;
}
