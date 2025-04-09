"use server";

import { User } from "@/lib/models/user";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { Session } from "@/lib/models/session";
import { cookies } from "next/headers";
import { DASHBOARD_ROUTE, SETTINGS_ROUTE } from "@/config/routes";

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

export async function login(formData) {
  const { userName, password } = Object.fromEntries(formData);

  try {
    connectToDB();

    const user = await User.findOne({ userName });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Les identifiants saisis sont incorrects.");
      }

      let session;
      const existingSession = await Session.findOne({
        userId: user._id,
        expiresAt: {
          $gt: new Date(),
        },
      });

      if (existingSession) {
        session = existingSession;
        existingSession.expiresAt = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        await existingSession.save();
      } else {
        session = new Session({
          userId: user._id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await session.save();
      }

      const cookieStore = await cookies();
      cookieStore.set("sessionId", session._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "Lax",
      });

      return { success: true };
    }

    throw new Error("Les identifiants saisis sont incorrects.");
  } catch (err) {
    console.log("Une erreur est survenue au moment de la connexion :", err);
    throw new Error(
      err.message || "Une erreur est survenue au moment de la connexion."
    );
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  try {
    await Session.findByIdAndDelete(sessionId);

    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
      sameSite: "script",
    });

    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function isPrivatePage(pathname) {
  const privateSegments = [DASHBOARD_ROUTE, `${SETTINGS_ROUTE}/profile`];

  return privateSegments.some(
    (segment) => pathname === segment || path.startsWith(segment + "/")
  );
}
