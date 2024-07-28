/**
 * Creates a new proxy to efficiently add properties to class without creating subclasses
 *
 * @param target - The constructor of the class to modify
 * @param handler - The handler function to modify the constructor behavior for the target
 */
export function createProxy<T extends object>(target: T, handler: Omit<ProxyHandler<T>, 'get'>): T {
	return new Proxy(target, {
		...handler,
		get: (target, property) => {
			const value = Reflect.get(target, property);
			return typeof value === 'function' ? (...args: readonly unknown[]) => value.apply(target, args) : value;
		}
	});
}
