import { db } from "../../db/db";
import { users, hashPassword } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "employee" | "customer" = "customer"
) {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser.length > 0) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Insert user into database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return { message: "User registered successfully" };
}

export async function loginUser(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) throw new Error("Invalid email or password");

  // Generate JWT token
  const token = jwt.sign(
    { id: user[0].id, role: user[0].role, email: user[0].email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return { token };
}
