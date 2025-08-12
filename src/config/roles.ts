// Definición de roles del sistema
export const ROLES = {
	ADMIN: "admin",
	MANAGER: "manager",
	SELLER: "seller",
	SUPPORT: "support",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

// Definición de permisos por módulos
export const PERMISSIONS = {
	// Usuarios
	USERS_READ: "users:read",
	USERS_WRITE: "users:write",
	USERS_DELETE: "users:delete",

	// Productos
	PRODUCTS_READ: "products:read",
	PRODUCTS_WRITE: "products:write",
	PRODUCTS_DELETE: "products:delete",

	// Órdenes
	ORDERS_READ: "orders:read",
	ORDERS_WRITE: "orders:write",
	ORDERS_DELETE: "orders:delete",

	// Clientes
	CLIENTS_READ: "clients:read",
	CLIENTS_WRITE: "clients:write",
	CLIENTS_DELETE: "clients:delete",

	// Almacenes
	STORAGES_READ: "storages:read",
	STORAGES_WRITE: "storages:write",
	STORAGES_DELETE: "storages:delete",

	// Pagos
	PAYMENTS_READ: "payments:read",
	PAYMENTS_WRITE: "payments:write",
	PAYMENTS_DELETE: "payments:delete",

	// Analytics
	ANALYTICS_READ: "analytics:read",

	// Configuración
	SETTINGS_READ: "settings:read",
	SETTINGS_WRITE: "settings:write",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Mapeo de roles a permisos
export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
	[ROLES.ADMIN]: [
		// Admins tienen todos los permisos
		PERMISSIONS.USERS_READ,
		PERMISSIONS.USERS_WRITE,
		PERMISSIONS.USERS_DELETE,
		PERMISSIONS.PRODUCTS_READ,
		PERMISSIONS.PRODUCTS_WRITE,
		PERMISSIONS.PRODUCTS_DELETE,
		PERMISSIONS.ORDERS_READ,
		PERMISSIONS.ORDERS_WRITE,
		PERMISSIONS.ORDERS_DELETE,
		PERMISSIONS.CLIENTS_READ,
		PERMISSIONS.CLIENTS_WRITE,
		PERMISSIONS.CLIENTS_DELETE,
		PERMISSIONS.STORAGES_READ,
		PERMISSIONS.STORAGES_WRITE,
		PERMISSIONS.STORAGES_DELETE,
		PERMISSIONS.PAYMENTS_READ,
		PERMISSIONS.PAYMENTS_WRITE,
		PERMISSIONS.PAYMENTS_DELETE,
		PERMISSIONS.ANALYTICS_READ,
		PERMISSIONS.SETTINGS_READ,
		PERMISSIONS.SETTINGS_WRITE,
	],
	[ROLES.MANAGER]: [
		// Managers pueden gestionar usuarios (excepto admin), productos, órdenes, clientes y ver analytics
		PERMISSIONS.USERS_READ,
		PERMISSIONS.USERS_WRITE,
		PERMISSIONS.PRODUCTS_READ,
		PERMISSIONS.PRODUCTS_WRITE,
		PERMISSIONS.PRODUCTS_DELETE,
		PERMISSIONS.ORDERS_READ,
		PERMISSIONS.ORDERS_WRITE,
		PERMISSIONS.ORDERS_DELETE,
		PERMISSIONS.CLIENTS_READ,
		PERMISSIONS.CLIENTS_WRITE,
		PERMISSIONS.CLIENTS_DELETE,
		PERMISSIONS.STORAGES_READ,
		PERMISSIONS.STORAGES_WRITE,
		PERMISSIONS.PAYMENTS_READ,
		PERMISSIONS.PAYMENTS_WRITE,
		PERMISSIONS.ANALYTICS_READ,
		PERMISSIONS.SETTINGS_READ,
	],
	[ROLES.SELLER]: [
		PERMISSIONS.PRODUCTS_READ,
		PERMISSIONS.ORDERS_READ,
		PERMISSIONS.ORDERS_WRITE,
		PERMISSIONS.CLIENTS_READ,
		PERMISSIONS.CLIENTS_WRITE,
		PERMISSIONS.STORAGES_READ,
		PERMISSIONS.PAYMENTS_READ,
	],
	[ROLES.SUPPORT]: [
		// Support solo puede leer
		PERMISSIONS.PRODUCTS_READ,
		PERMISSIONS.ORDERS_READ,
		PERMISSIONS.CLIENTS_READ,
		PERMISSIONS.STORAGES_READ,
		PERMISSIONS.PAYMENTS_READ,
	],
};

// Jerarquía de roles (de menor a mayor privilegio)
export const ROLE_HIERARCHY: Record<RoleType, number> = {
	[ROLES.SUPPORT]: 1,
	[ROLES.SELLER]: 2,
	[ROLES.MANAGER]: 3,
	[ROLES.ADMIN]: 4,
};

// Rutas protegidas por rol
export const PROTECTED_ROUTES: Record<string, RoleType[]> = {
	"/dashboard": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER, ROLES.SUPPORT],
	"/dashboard/users": [ROLES.ADMIN, ROLES.MANAGER],
	"/dashboard/settings": [ROLES.ADMIN, ROLES.MANAGER],
	"/dashboard/analytics": [ROLES.ADMIN, ROLES.MANAGER],
	"/dashboard/products": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
	"/dashboard/orders": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
	"/dashboard/clients": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
	"/dashboard/storages": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
	"/dashboard/payments": [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
};
