import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types/models/users";
import { connectToMongo } from "./mongo";

// Usuario demo por defecto (funciona sin base de datos)
const DEMO_USER = {
	id: "demo-admin-id",
	email: "admin@admin.com",
	username: "admin",
	password: "$2b$10$eEsdWIqhK0DuY1Y7wmYeZeFX00S4.OgYoO4Y0sDu86QdRDlMBxqIe", // admin1234
	firstName: "Admin",
	lastName: "Demo",
	role: "admin" as UserRole,
	isActive: true,
};

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Correo Electrónico", type: "email" },
				password: { label: "Contraseña", type: "password" },
			},
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const { email, password } = credentials;

				// Primero verificar si es el usuario demo
				if (email === DEMO_USER.email && bcrypt.compareSync(password, DEMO_USER.password)) {
					// Intentar MongoDB con timeout corto, si falla usar demo
					try {
						const timeoutPromise = new Promise((_, reject) => 
							setTimeout(() => reject(new Error("MongoDB timeout")), 3000)
						);
						
						const mongoPromise = (async () => {
							await connectToMongo();
							const { User } = await import("@/contexts/users/model");
							return await User.findOne({ email });
						})();

						const user = await Promise.race([mongoPromise, timeoutPromise]) as any;
						
						if (user && bcrypt.compareSync(password, user.password)) {
							return {
								id: user._id.toString(),
								email: user.email,
								username: user.username,
								firstName: user.firstName,
								lastName: typeof user.lastName === "string" ? user.lastName : "",
								role: user.role,
								avatar: typeof user.avatar === "string" ? user.avatar : undefined,
								phone: typeof user.phone === "string" ? user.phone : undefined,
							};
						}
					} catch {
						// MongoDB no disponible, usar demo
					}
					
					console.log("✅ Logged in with demo user");
					return {
						id: DEMO_USER.id,
						email: DEMO_USER.email,
						username: DEMO_USER.username,
						firstName: DEMO_USER.firstName,
						lastName: DEMO_USER.lastName,
						role: DEMO_USER.role,
						avatar: undefined,
						phone: undefined,
					};
				}

				// Para otros usuarios, solo MongoDB
				try {
					await connectToMongo();
					const { User } = await import("@/contexts/users/model");
					const user = await User.findOne({ email });

					if (user && bcrypt.compareSync(password, user.password)) {
						return {
							id: user._id.toString(),
							email: user.email,
							username: user.username,
							firstName: user.firstName,
							lastName: typeof user.lastName === "string" ? user.lastName : "",
							role: user.role,
							avatar: typeof user.avatar === "string" ? user.avatar : undefined,
							phone: typeof user.phone === "string" ? user.phone : undefined,
						};
					}
				} catch (error) {
					console.error("MongoDB auth error:", error instanceof Error ? error.message : "Unknown error");
				}

				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.username = user.username;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.role = user.role;
				token.avatar = user.avatar;
				token.phone = user.phone;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.email = token.email ?? "";
				session.user.username = token.username as string;
				session.user.firstName = token.firstName as string;
				session.user.lastName = token.lastName as string;
				session.user.role = token.role as UserRole;
				session.user.avatar = token.avatar as string;
				session.user.phone = token.phone as string;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
	interface User {
		id: string;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		role: UserRole;
		avatar?: string;
		phone?: string;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			username: string;
			firstName: string;
			lastName: string;
			role: UserRole;
			avatar?: string;
			phone?: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username: string;
		firstName: string;
		lastName: string;
		role: UserRole;
		avatar?: string;
		phone?: string;
	}
}
