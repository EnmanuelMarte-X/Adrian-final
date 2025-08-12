import { usePermissions } from "@/hooks/use-auth";
import type { ReactNode } from "react";
import type { PermissionType } from "@/config/roles";

interface PermissionGuardProps {
	children: ReactNode;
	permission: PermissionType;
	fallback?: ReactNode;
}

export function PermissionGuard({
	children,
	permission,
	fallback = null,
}: PermissionGuardProps) {
	const { hasPermission } = usePermissions();

	if (!hasPermission(permission)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
