import { useSession } from "next-auth/react";
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
import {
	ROLES,
	PERMISSIONS,
	type RoleType,
	type PermissionType,
} from "@/config/roles";

export function useAuth() {
	const { data: session, status } = useSession();

	return {
		user: session?.user,
		isLoading: status === "loading",
		isAuthenticated: !!session?.user,
		role: session?.user?.role,
		status,
	};
}

export function useRole() {
	const { role } = useAuth();

	if (!role) {
		return {
			hasRole: () => false,
			hasAnyRole: () => false,
			hasAllRoles: () => false,
			getHighestRole: () => null,
			isAdmin: false,
			isManager: false,
			isSeller: false,
			isSupport: false,
			isRoleHigherOrEqual: () => false,
		};
	}

	return {
		hasRole: (targetRole: RoleType) => hasRole(role, targetRole),
		hasAnyRole: (roleList: RoleType[]) => hasAnyRole(role, roleList),
		hasAllRoles: (roleList: RoleType[]) => hasAllRoles(role, roleList),
		getHighestRole: () => getHighestRole(role),
		isAdmin: hasRole(role, ROLES.ADMIN),
		isManager: hasRole(role, ROLES.MANAGER),
		isSeller: hasRole(role, ROLES.SELLER),
		isSupport: hasRole(role, ROLES.SUPPORT),
		isRoleHigherOrEqual: (targetRole: RoleType) =>
			isRoleHigherOrEqual(role, targetRole),
	};
}

export function usePermissions() {
	const { role } = useAuth();

	if (!role) {
		return {
			hasPermission: () => false,
			hasAnyPermission: () => false,
			getUserPermissions: () => [],
			canRead: () => false,
			canWrite: () => false,
			canDelete: () => false,
		};
	}

	return {
		hasPermission: (permission: PermissionType) =>
			hasPermission(role, permission),
		hasAnyPermission: (permissions: PermissionType[]) =>
			hasAnyPermission(role, permissions),
		getUserPermissions: () => getUserPermissions(role),
		canRead: (resource: string) => {
			const permission = `${resource}:read` as PermissionType;
			return hasPermission(role, permission);
		},
		canWrite: (resource: string) => {
			const permission = `${resource}:write` as PermissionType;
			return hasPermission(role, permission);
		},
		canDelete: (resource: string) => {
			const permission = `${resource}:delete` as PermissionType;
			return hasPermission(role, permission);
		},
	};
}

// Hook para verificación de acceso a rutas
export function useRouteAccess() {
	const { role } = useAuth();

	if (!role) {
		return {
			hasRouteAccess: () => false,
			canAccessDashboard: false,
			canAccessUsers: false,
			canAccessSettings: false,
			canAccessAnalytics: false,
		};
	}

	return {
		hasRouteAccess: (route: string) => hasRouteAccess(role, route),
		canAccessDashboard: hasRouteAccess(role, "/dashboard"),
		canAccessUsers: hasRouteAccess(role, "/dashboard/users"),
		canAccessSettings: hasRouteAccess(role, "/dashboard/settings"),
		canAccessAnalytics: hasRouteAccess(role, "/dashboard/analytics"),
	};
}

// Hook combinado para todas las verificaciones de autorización
export function useAuthorization() {
	const auth = useAuth();
	const roleUtils = useRole();
	const permissions = usePermissions();
	const routeAccess = useRouteAccess();

	return {
		...auth,
		...roleUtils,
		...permissions,
		...routeAccess,
	};
}

// Hooks de conveniencia para verificaciones específicas
export function useIsAdmin() {
	const { isAdmin } = useRole();
	return isAdmin;
}

export function useIsManager() {
	const { isManager } = useRole();
	return isManager;
}

export function useIsSeller() {
	const { isSeller } = useRole();
	return isSeller;
}

export function useIsSupport() {
	const { isSupport } = useRole();
	return isSupport;
}

// Hook para verificar si el usuario puede realizar acciones específicas
export function useCanPerform() {
	const { hasPermission } = usePermissions();

	return {
		// Usuarios
		canReadUsers: hasPermission(PERMISSIONS.USERS_READ),
		canWriteUsers: hasPermission(PERMISSIONS.USERS_WRITE),
		canDeleteUsers: hasPermission(PERMISSIONS.USERS_DELETE),

		// Productos
		canReadProducts: hasPermission(PERMISSIONS.PRODUCTS_READ),
		canWriteProducts: hasPermission(PERMISSIONS.PRODUCTS_WRITE),
		canDeleteProducts: hasPermission(PERMISSIONS.PRODUCTS_DELETE),

		// Órdenes
		canReadOrders: hasPermission(PERMISSIONS.ORDERS_READ),
		canWriteOrders: hasPermission(PERMISSIONS.ORDERS_WRITE),
		canDeleteOrders: hasPermission(PERMISSIONS.ORDERS_DELETE),

		// Clientes
		canReadClients: hasPermission(PERMISSIONS.CLIENTS_READ),
		canWriteClients: hasPermission(PERMISSIONS.CLIENTS_WRITE),
		canDeleteClients: hasPermission(PERMISSIONS.CLIENTS_DELETE),

		// Almacenes
		canReadStorages: hasPermission(PERMISSIONS.STORAGES_READ),
		canWriteStorages: hasPermission(PERMISSIONS.STORAGES_WRITE),
		canDeleteStorages: hasPermission(PERMISSIONS.STORAGES_DELETE),

		// Pagos
		canReadPayments: hasPermission(PERMISSIONS.PAYMENTS_READ),
		canWritePayments: hasPermission(PERMISSIONS.PAYMENTS_WRITE),
		canDeletePayments: hasPermission(PERMISSIONS.PAYMENTS_DELETE),

		// Analytics y configuración
		canReadAnalytics: hasPermission(PERMISSIONS.ANALYTICS_READ),
		canReadSettings: hasPermission(PERMISSIONS.SETTINGS_READ),
		canWriteSettings: hasPermission(PERMISSIONS.SETTINGS_WRITE),
	};
}
