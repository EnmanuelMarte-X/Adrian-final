import { User } from "../contexts/users/model";
import bcrypt from "bcryptjs";

let seeded = false;

export async function seedDefaultAdmin() {
	// Solo ejecutar una vez por instancia
	if (seeded) return;
	seeded = true;

	try {
		const email = "admin@admin.com";

		// Verificar si ya existe algún usuario admin
		const adminExists = await User.findOne({ email });

		if (!adminExists) {
			const password = "admin1234";
			const hashedPassword = await bcrypt.hash(password, 10);

			await User.create({
				email,
				username: "admin",
				password: hashedPassword,
				firstName: "Admin",
				lastName: "Sistema",
				role: "admin",
				isActive: true,
			});

			console.log("✅ Usuario admin creado automáticamente:");
			console.log("   Email: admin@admin.com");
			console.log("   Contraseña: admin1234");
		}
	} catch (error) {
		// Si hay error (ej: índice duplicado), ignorar silenciosamente
		// El usuario ya existe
		console.log("ℹ️ Usuario admin ya existe o no se pudo crear");
	}
}
