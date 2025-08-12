import { useRouteAccess } from "@/hooks/use-auth";
import type { ReactNode } from "react";

interface RouteGuardProps {
	children: ReactNode;
	route: string;
	fallback?: ReactNode;
}

export function RouteGuard({
	children,
	route,
	fallback = null,
}: RouteGuardProps) {
	const { hasRouteAccess } = useRouteAccess();

	if (!hasRouteAccess(route)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
