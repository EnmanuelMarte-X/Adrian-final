import { useEffect, useRef } from "react";

export function useScrollPosition() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const positionRef = useRef<number>(0);

	// Save scroll position before component updates
	useEffect(() => {
		const savePosition = () => {
			if (scrollRef.current) {
				positionRef.current = window.scrollY;
			}
		};

		// Save position before any updates
		window.addEventListener("scroll", savePosition);

		return () => {
			window.removeEventListener("scroll", savePosition);
		};
	}, []);

	// Restore scroll position after render
	useEffect(() => {
		if (positionRef.current > 0) {
			window.scrollTo(0, positionRef.current);
		}
	});

	return scrollRef;
}
