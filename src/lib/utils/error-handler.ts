import { exit } from 'node:process';
import { DiscordAPIError } from '@discordjs/rest';
import { container } from '@sapphire/pieces';

export function handleError(error: Error) {
	if (error instanceof DiscordAPIError) {
		switch (error.code) {
			case 400: {
				badRequest();
				return;
			}

			case 401: {
				invalidTokenProvided();
				return;
			}

			case 403: {
				missingPermissions();
				return;
			}

			case 404: {
				invalidApplicationId();
				return;
			}

			case 500: {
				serverError();
				return;
			}
		}
	}

	unknownError();
}

function badRequest() {
	container.logger.fatal('The provided query was invalid.');
	exit(1);
}

function invalidTokenProvided() {
	container.logger.fatal('The provided token is invalid. Please check the token and try again.');
	exit(1);
}

function missingPermissions() {
	container.logger.fatal('The bot does not have the necessary permissions to perform this action.');
	exit(1);
}

function invalidApplicationId() {
	container.logger.fatal('The provided application ID is invalid. Please check the application ID and try again.');
	exit(1);
}

function serverError() {
	container.logger.fatal('The Discord API is experiencing issues. Please try again later.');
	exit(1);
}

function unknownError() {
	container.logger.fatal('An unknown error occurred. Please try again later.');
	exit(1);
}
