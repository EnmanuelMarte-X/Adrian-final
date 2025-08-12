"use client";

import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { queryClient } from "@/lib/query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
					storageKey="js_theme"
				>
					<NuqsAdapter>{children}</NuqsAdapter>
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}
