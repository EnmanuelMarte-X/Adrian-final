import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement | null>(
	elementRef: RefObject<T>,
	callback?: () => void,
	options?: { enabled?: boolean },
) {
	const handleClickOutside = (event: MouseEvent) => {
		if (
			elementRef.current &&
			!elementRef.current.contains(event.target as Node)
		) {
			callback?.();
			return;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to run this effect only once when the component mounts.
	useEffect(() => {
		if (!options?.enabled || !elementRef.current) return;

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [elementRef]);
}
