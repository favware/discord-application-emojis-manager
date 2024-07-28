/* eslint-disable @typescript-eslint/unified-signatures */
import type { Container, Piece, StoreRegistryKey } from '@sapphire/pieces';
import type { Ctor } from '@sapphire/utilities';
import { createProxy } from '#lib/decorators/utils';

/**
 * Allow for custom element classes with private constructors
 */
export type AppliedOptionsPiece = Omit<typeof Piece, 'new'>;

// Modern ECMAScript decorators
export type ApplyOptionsDecorator = (target: AppliedOptionsPiece, context: ClassDecoratorContext<Ctor<ConstructorParameters<typeof Piece>>>) => void;

/**
 * Decorator function that applies given options to any Sapphire piece
 *
 * @param options - The options
 */

export function ApplyOptions<T extends Piece.Options>(options: T | ((parameters: ApplyOptionsCallbackParameters) => T)): ApplyOptionsDecorator {
	return (classOrTarget: AppliedOptionsPiece | Ctor<ConstructorParameters<typeof Piece>>): void => {
		createProxy(classOrTarget as Ctor<ConstructorParameters<typeof Piece>, Piece>, {
			construct: (ctor, [context, baseOptions = {} as T]: [Piece.LoaderContext<StoreRegistryKey>, T]) =>
				new ctor(context, {
					...baseOptions,
					...options
				})
		});
	};
}

export interface ApplyOptionsCallbackParameters {
	container: Container;
	context: Piece.LoaderContext;
}
