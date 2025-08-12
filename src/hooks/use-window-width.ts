import { useState, useEffect } from "react";

/**
 * Hook personalizado para obtener el ancho actual de la ventana
 * y actualizar automáticamente cuando la ventana cambie de tamaño
 */
export function useWindowWidth(): number {
	const [windowWidth, setWindowWidth] = useState<number>(1400);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setWindowWidth(window.innerWidth);

			const handleResize = () => setWindowWidth(window.innerWidth);
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	return windowWidth;
}
