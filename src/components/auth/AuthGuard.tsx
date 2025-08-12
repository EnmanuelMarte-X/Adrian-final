import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

interface AuthGuardProps {
	children: ReactNode;
	fallback?: ReactNode;
	redirectTo?: string;
}

export function AuthGuard({ children, fallback = null }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
