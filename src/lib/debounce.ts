/**
 * Creates a debounced function that delays invoking the provided function
 * until after 'wait' milliseconds have elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function that returns a Promise with the result
 *
 * @example
 * // Simple usage
 * const debouncedSearch = debounce(searchFunction, 300);
 * debouncedSearch('query').then(results => console.log(results));
 */

// biome-ignore lint/suspicious/noExplicitAny: This is a generic function.
export const debounce = <T extends (...args: any[]) => unknown>(
	func: T,
	wait: number,
) => {
	let timeout: NodeJS.Timeout | undefined;
	let pendingPromise: Promise<ReturnType<T>> | null = null;
	let pendingResolve: ((value: ReturnType<T>) => void) | null = null;

	return (...args: Parameters<T>): Promise<ReturnType<T>> => {
		// Clear any existing timeout
		if (timeout) clearTimeout(timeout);

		// Create a new promise if there isn't one pending
		if (!pendingPromise) {
			pendingPromise = new Promise((resolve) => {
				pendingResolve = resolve as (value: ReturnType<T>) => void;
			});
		}

		// Set the new timeout
		timeout = setTimeout(() => {
			const result = func(...args) as ReturnType<T>;
			if (pendingResolve) pendingResolve(result);
			pendingPromise = null;
			pendingResolve = null;
			timeout = undefined;
		}, wait);

		return pendingPromise;
	};
};
