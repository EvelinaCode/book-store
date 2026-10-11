import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";
import AppError from "../errors/AppError.js";

export async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
