"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

const themeLabels = {
	light: "Claro",
	dark: "Oscuro",
	system: "Sistema",
};

export function ModeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="gap-1 px-2 py-0 text-xs">
					<span className="capitalize">
						{themeLabels[theme as keyof typeof themeLabels]}
					</span>
					<ChevronsUpDownIcon className="size-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					{themeLabels.light}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					{themeLabels.dark}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					{themeLabels.system}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
