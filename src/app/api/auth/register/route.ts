import { NextResponse, type NextRequest } from "next/server";
import { APIError } from "@/contexts/shared/exceptions";
import bcrypt from "bcryptjs";
import { User } from "@/contexts/users/model";
import { connectToMongo } from "@/lib/mongo";

export const POST = async (request: NextRequest) => {
	try {
		const { email, password, username } = await request.json();

		// Validar campos requeridos
		if (!email || !password || !username) {
			return NextResponse.json(
				{ error: "Todos los campos son requeridos" },
				{ status: 400 },
			);
		}

		// Validar formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Correo electrónico inválido" },
				{ status: 400 },
			);
		}

		// Validar longitud de contraseña
		if (password.length < 8) {
			return NextResponse.json(
				{ error: "La contraseña debe tener al menos 8 caracteres" },
				{ status: 400 },
			);
		}

		// Hashear contraseña
		const hashedPassword = await bcrypt.hash(password, 10);

		// Conectar a la base de datos
		await connectToMongo();

		// Crear usuario con rol de support por defecto
		const newUser = await User.create({
			email,
			password: hashedPassword,
			firstName: username, // Usar username como firstName por defecto
			lastName: "", // Dejar vacío por ahora
			username,
			role: "support",
			isActive: true,
		});

		// Convertir a objeto y no devolver la contraseña
		const userObject = newUser.toObject();
		const { password: _, ...userWithoutPassword } = userObject;

		return NextResponse.json(userWithoutPassword, { status: 201 });
	} catch (error) {
		console.error("Error al registrar usuario:", error);
		
		if (error instanceof APIError) {
			return error.toNextResponse();
		}

		const errorMessage = (error as Error).message;

		// Manejar errores de MongoDB para duplicados
		if (errorMessage.includes("duplicate key") || errorMessage.includes("E11000")) {
			if (errorMessage.includes("email")) {
				return NextResponse.json(
					{ error: "El correo electrónico ya está registrado" },
					{ status: 409 },
				);
			}
			if (errorMessage.includes("username")) {
				return NextResponse.json(
					{ error: "El nombre de usuario ya está en uso" },
					{ status: 409 },
				);
			}
			return NextResponse.json(
				{ error: "El usuario ya existe" },
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{ error: "Error al crear el usuario" },
			{ status: 500 },
		);
	}
};
