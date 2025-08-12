import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ComponentProps } from "react";

interface LogoProps extends Omit<ComponentProps<typeof Image>, "src" | "alt"> {
	width?: number;
	height?: number;
}

export function Logo({
	width = 56,
	height = 56,
	className,
	...rest
}: LogoProps) {
	return (
		<Image
			src="/logo.png"
			className={cn("aspect-square", className)}
			width={width}
			height={height}
			{...rest}
			alt="Logo"
		/>
	);
}
