import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
	hasRole,
	hasAnyRole,
	hasAllRoles,
	hasPermission,
	hasRouteAccess,
	getHighestRole,
	getUserPermissions,
	hasAnyPermission,
	isRoleHigherOrEqual,
} from "@/lib/auth-client";
import type { RoleType, PermissionType } from "@/config/roles";

// RE-EXPORTAR las funciones del cliente para compatibilidad
export {
	hasRole,
	hasAnyRole,
	hasAllRoles,
	hasPermission,
	hasRouteAccess,
	getHighestRole,
	getUserPermissions,
	hasAnyPermission,
	isRoleHigherOrEqual,
};

// FUNCIONES ESPECÍFICAS DEL SERVIDOR

// Obtener sesión del servidor
export async function getServerAuthSession() {
	return await getServerSession(authOptions);
}

// Requerir autenticación
export async function requireAuth() {
	const session = await getServerAuthSession();

	if (!session?.user) {
		throw new Error("No autorizado");
	}

	return session;
}

// Requerir permiso específico
export async function requirePermission(permission: PermissionType) {
	const session = await requireAuth();

	if (!hasPermission(session.user.role, permission)) {
		throw new Error(`Permiso requerido: ${permission}`);
	}

	return session;
}

// Requerir rol específico
export async function requireRole(role: RoleType) {
	const session = await requireAuth();

	if (!hasRole(session.user.role, role)) {
		throw new Error(`Rol requerido: ${role}`);
	}

	return session;
}

// Requerir alguno de los roles especificados
export async function requireAnyRole(roles: RoleType[]) {
	const session = await requireAuth();

	if (!hasAnyRole(session.user.role, roles)) {
		throw new Error(`Alguno de estos roles es requerido: ${roles.join(", ")}`);
	}

	return session;
}
