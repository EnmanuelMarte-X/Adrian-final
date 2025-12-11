import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types/models/users";
import { connectToMongo } from "./mongo";

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

				try {
					await connectToMongo();

					// Importación dinámica del modelo para evitar problemas de timing
					const { User } = await import("@/contexts/users/model");

					const { email, password } = credentials;

					// Verificar que el modelo User está disponible
					if (!User) {
						console.error("User model is not available");
						return null;
					}

					const user = await User.findOne({ email: email });

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

					return null;
				} catch (error) {
					console.error("Auth error:", error);
					console.error("Error details:", {
						message: error instanceof Error ? error.message : "Unknown error",
						stack: error instanceof Error ? error.stack : undefined,
					});
					return null;
				}
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
