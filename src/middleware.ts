import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, type RoleType } from "@/config/roles";

export default withAuth(
	async function middleware(req) {
		const token = await getToken({ req });
		const isAuth = !!token;
		const path = req.nextUrl.pathname;

		// Redirigir usuarios autenticados del login al dashboard
		if (path.startsWith("/auth/login") && isAuth) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		// Verificar autenticación para APIs
		// Permitir que ciertas APIs públicas (por ejemplo listados de productos)
		// sean accesibles sin autenticación para poder mostrarlas desde la landing.
		if (path.startsWith("/api/") && path !== "/api/auth") {
			// Rutas públicas bajo /api/products*
			if (path.startsWith("/api/products")) {
				// dejar pasar sin token
			} else if (!isAuth) {
				return new NextResponse("Unauthorized", { status: 401 });
			}
		}

		// Verificar permisos de rol para rutas protegidas
		if (isAuth && token?.role) {
			const userRole = token.role as RoleType;

			// Verificar acceso a rutas protegidas basado en roles
			for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
				if (path.startsWith(route)) {
					if (!allowedRoles.includes(userRole)) {
						// Redirigir a dashboard principal si no tiene permisos
						return NextResponse.redirect(new URL("/dashboard", req.url));
					}
					break;
				}
			}
		}
	},
	{
		pages: { signIn: "/auth/login" },
		callbacks: {
			authorized: ({ token, req }) => {
				const path = req.nextUrl.pathname;
				// Allow public access to product listing APIs so the public
				// catalog can fetch products without authentication (e.g., incognito).
				if (path.startsWith("/api/") && path !== "/api/auth") {
					// If the API is under /api/products, allow it without token
					if (path.startsWith("/api/products")) return true;
					return !!token;
				}
				if (path.startsWith("/dashboard")) {
					return !!token;
				}
				if (path.startsWith("/recipient")) {
					return !!token;
				}
				return true;
			},
		},
	},
);

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/api/:path*",
		"/auth/login",
		"/recipient/:path*",
	],
};
