import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    // better to store on env file
    const adminData = {
      name: "Injam Admin",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "123456",
      emailVerified: true,
    };

    // check user exists on the database already
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    console.log(signUpAdmin);
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
