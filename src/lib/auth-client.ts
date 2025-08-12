import {
	ROLE_PERMISSIONS,
	ROLE_HIERARCHY,
	PROTECTED_ROUTES,
	type RoleType,
	type PermissionType,
} from "@/config/roles";

// UTILIDADES SOLO PARA EL CLIENTE (sin acceso a MongoDB)

// Verificar si un usuario tiene un rol específico
export function hasRole(userRole: RoleType, targetRole: RoleType): boolean {
	return userRole === targetRole;
}

// Verificar si un usuario tiene alguno de los roles especificados
export function hasAnyRole(
	userRole: RoleType,
	targetRoles: RoleType[],
): boolean {
	return targetRoles.includes(userRole);
}

// Verificar si un usuario tiene todos los roles especificados (en este caso, solo uno)
export function hasAllRoles(
	userRole: RoleType,
	targetRoles: RoleType[],
): boolean {
	return targetRoles.length === 1 && targetRoles.includes(userRole);
}

// Obtener el rol más alto (en este caso, el único rol del usuario)
export function getHighestRole(userRole: RoleType): RoleType {
	return userRole;
}

// Verificar si un usuario tiene un permiso específico
export function hasPermission(
	userRole: RoleType,
	permission: PermissionType,
): boolean {
	const rolePermissions = ROLE_PERMISSIONS[userRole];
	return rolePermissions.includes(permission);
}

// Verificar si un usuario tiene alguno de los permisos especificados
export function hasAnyPermission(
	userRole: RoleType,
	permissions: PermissionType[],
): boolean {
	const rolePermissions = ROLE_PERMISSIONS[userRole];
	return permissions.some((permission) => rolePermissions.includes(permission));
}

// Obtener todos los permisos de un usuario
export function getUserPermissions(userRole: RoleType): PermissionType[] {
	return ROLE_PERMISSIONS[userRole] || [];
}

// Verificar si un usuario tiene acceso a una ruta específica
export function hasRouteAccess(userRole: RoleType, route: string): boolean {
	const allowedRoles = PROTECTED_ROUTES[route];
	if (!allowedRoles) {
		return true; // Si la ruta no está protegida, permitir acceso
	}
	return allowedRoles.includes(userRole);
}

// Verificar si un rol es mayor o igual que otro en la jerarquía
export function isRoleHigherOrEqual(
	userRole: RoleType,
	targetRole: RoleType,
): boolean {
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}
