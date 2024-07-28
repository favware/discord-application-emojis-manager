import { exit } from 'node:process';
import { QueryError } from '@sapphire/fetch';
import { container } from '@sapphire/pieces';

export function handleError(error: Error) {
	if (error instanceof QueryError) {
		switch (error.code) {
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

			case 429: {
				rateLimited();
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

function rateLimited() {
	container.logger.fatal('The bot is being rate limited. Please try again later.');
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
