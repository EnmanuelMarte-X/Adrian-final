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
		if (path.startsWith("/api/") && path !== "/api/auth") {
			if (!isAuth) {
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
				if (path.startsWith("/api/") && path !== "/api/auth") {
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
