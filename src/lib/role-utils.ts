// UTILIDADES DE ROLES SEGURAS PARA CLIENTE Y SERVIDOR

import { ROLES, ROLE_HIERARCHY, type RoleType } from "@/config/roles";

// Convertir string a RoleType de forma segura
export function toRoleType(role: string): RoleType | null {
	const roleValues = Object.values(ROLES) as string[];
	return roleValues.includes(role) ? (role as RoleType) : null;
}

// Validar si un string es un rol válido
export function isValidRole(role: string): role is RoleType {
	return Object.values(ROLES).includes(role as RoleType);
}

// Obtener todos los roles disponibles
export function getAllRoles(): RoleType[] {
	return Object.values(ROLES);
}

// Obtener roles ordenados por jerarquía (de menor a mayor)
export function getRolesOrderedByHierarchy(): RoleType[] {
	return Object.entries(ROLE_HIERARCHY)
		.sort(([, a], [, b]) => a - b)
		.map(([role]) => role as RoleType);
}

// Obtener roles ordenados por jerarquía (de mayor a menor)
export function getRolesOrderedByHierarchyDesc(): RoleType[] {
	return Object.entries(ROLE_HIERARCHY)
		.sort(([, a], [, b]) => b - a)
		.map(([role]) => role as RoleType);
}

// Obtener el nombre legible de un rol
export function getRoleDisplayName(role: RoleType): string {
	const roleNames: Record<RoleType, string> = {
		[ROLES.ADMIN]: "Administrador",
		[ROLES.MANAGER]: "Gerente",
		[ROLES.SELLER]: "Vendedor",
		[ROLES.SUPPORT]: "Soporte",
	};

	return roleNames[role] || role;
}

// Obtener la descripción de un rol
export function getRoleDescription(role: RoleType): string {
	const roleDescriptions: Record<RoleType, string> = {
		[ROLES.ADMIN]:
			"Acceso completo al sistema, puede gestionar usuarios y configuración",
		[ROLES.MANAGER]:
			"Puede gestionar productos, órdenes, clientes y ver analytics",
		[ROLES.SELLER]: "Puede gestionar productos, órdenes y clientes",
		[ROLES.SUPPORT]: "Solo lectura de productos, órdenes, clientes y almacenes",
	};

	return roleDescriptions[role] || "Sin descripción disponible";
}

// Obtener el color asociado a un rol (para UI)
export function getRoleColor(role: RoleType): string {
	const roleColors: Record<RoleType, string> = {
		[ROLES.ADMIN]: "red",
		[ROLES.MANAGER]: "blue",
		[ROLES.SELLER]: "green",
		[ROLES.SUPPORT]: "gray",
	};

	return roleColors[role] || "gray";
}

// Obtener roles que un usuario puede asignar basado en su rol actual
export function getAssignableRoles(currentUserRole: RoleType): RoleType[] {
	const currentLevel = ROLE_HIERARCHY[currentUserRole];

	return Object.entries(ROLE_HIERARCHY)
		.filter(([, level]) => level < currentLevel)
		.map(([role]) => role as RoleType);
}

// Verificar si un usuario puede gestionar a otro usuario basado en roles
export function canManageUser(
	managerRole: RoleType,
	targetUserRole: RoleType,
): boolean {
	return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetUserRole];
}
