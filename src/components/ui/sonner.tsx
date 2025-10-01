"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				className: "bg-popover text-popover-foreground border-2",
				style: { borderRadius: "var(--radius-xl)" },
			}}
			{...props}
		/>
	);
};

export { Toaster };
