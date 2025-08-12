import type { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole, UserType } from "@/types/models/users";
import { ROLES } from "@/config/roles";
import { UserUnauthorizedException } from "./exceptions";

export interface AuthenticatedRequest extends NextRequest {
	user: UserType;
}

export function withAuth(
	handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
	return async (req: NextRequest) => {
		try {
			const token = await getToken({
				req,
				secret: process.env.NEXTAUTH_SECRET,
			});

			if (!token) {
				return;
			}

			const authenticatedReq = req as AuthenticatedRequest;
			authenticatedReq.user = {
				_id: token.id as string,
				email: token.email as string,
				username: token.username as string,
				firstName: token.firstName as string,
				lastName: token.lastName as string,
				role: token.role as UserRole,
				avatar: token.avatar as string,
				phone: token.phone as string,
				isActive: token.isActive as boolean,
				createdAt: token.createdAt as string,
				updatedAt: token.updatedAt as string,
			};

			return handler(authenticatedReq);
		} catch {
			return new UserUnauthorizedException().toNextResponse();
		}
	};
}

export function withAdminOnly() {
	return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
		return withAuth(async (req) => {
			const isAdmin = req.user.role === ROLES.ADMIN;

			if (!isAdmin) {
				return new UserUnauthorizedException().toNextResponse();
			}

			return handler(req);
		});
	};
}

export function withManagerOrAdmin() {
	return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
		return withAuth(async (req) => {
			const hasAccess =
				req.user.role === ROLES.ADMIN || req.user.role === ROLES.MANAGER;

			if (!hasAccess) {
				return new UserUnauthorizedException().toNextResponse();
			}

			return handler(req);
		});
	};
}
