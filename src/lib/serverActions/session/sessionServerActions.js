"use server";

import { User } from "@/lib/models/user";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import slugify from "slugify";
import bcrypt from "bcryptjs";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } =
    Object.fromEntries(formData);

  if (userName.length < 3) {
    throw new Error(
      "Le nom d'utilisateur doit contenir au moins 3 caractères."
    );
  }

  if (password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }

  if (password !== passwordRepeat) {
    throw new Error("Les mots de passe saisis ne sont pas identiques.");
  }

  try {
    connectToDB();

    const user = await User.findOne({ userName });

    if (user) {
      throw new Error("L'utilisateur existe déjà.");
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true };
  } catch (err) {
    console.log(
      "Une erreur est survenue au moment de la création de l'utilisateur :",
      err
    );
    throw new Error(
      err.message ||
        "Une erreur est survenue au moment de la création de l'utilisateur."
    );
  }
}
