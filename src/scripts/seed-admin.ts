import { connectToMongo } from "../lib/mongo";
import { User } from "../contexts/users/model";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  await connectToMongo();
  const email = "admin@admin.com";
  const username = "admin";
  const password = "admin1234";
  const firstName = "Admin";
  const lastName = "";
  const role = "admin";

  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      role,
      isActive: true,
    });
    console.log("Usuario admin creado: admin@admin.com / admin1234");
  } else {
    console.log("El usuario admin ya existe");
  }
  process.exit(0);
}

seedAdmin();
