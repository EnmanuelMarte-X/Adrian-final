"use client";

import { useRole } from "@/hooks/use-auth";
import type { ReactNode } from "react";
import type { RoleType } from "@/config/roles";

interface RoleGuardProps {
	children: ReactNode;
	roles: RoleType | RoleType[];
	requireAll?: boolean;
	fallback?: ReactNode;
}

export function RoleGuard({
	children,
	roles,
	requireAll = false,
	fallback = null,
}: RoleGuardProps) {
	const { hasRole, hasAnyRole, hasAllRoles } = useRole();

	const rolesArray = Array.isArray(roles) ? roles : [roles];

	let hasAccess: boolean;

	if (requireAll) {
		hasAccess = hasAllRoles(rolesArray);
	} else if (rolesArray.length === 1) {
		hasAccess = hasRole(rolesArray[0]);
	} else {
		hasAccess = hasAnyRole(rolesArray);
	}

	if (!hasAccess) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
