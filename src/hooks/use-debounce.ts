import { useState, useEffect, useCallback, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

// biome-ignore lint/suspicious/noExplicitAny: this is a utility hook
export function useDebouncedCallback<T extends (...args: any[]) => void>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const callbackRef = useRef(callback);

	// Update callback ref when callback changes
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return useCallback(
		(...args: Parameters<T>) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			timerRef.current = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);
		},
		[delay],
	);
}
