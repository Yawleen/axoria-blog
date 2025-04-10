"use server";

import { User } from "@/lib/models/user";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { Session } from "@/lib/models/session";
import { cookies } from "next/headers";
import { DASHBOARD_ROUTE, SETTINGS_ROUTE } from "@/config/routes";
import AppError from "@/lib/utils/errorHandling/customError";

export async function register(formData) {
  const { userName, email, password, passwordRepeat } =
    Object.fromEntries(formData);

  try {
    if (typeof userName !== "string" || userName.trim().length < 3) {
      throw new AppError(
        "Le nom d'utilisateur doit contenir au moins 3 caractères."
      );
    }

    if (typeof password !== "string" || password.trim().length < 6) {
      throw new AppError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
    }

    if (password !== passwordRepeat) {
      throw new AppError("Les mots de passe saisis ne sont pas identiques.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      throw new AppError("Le format de l'email est invalide.");
    }

    await connectToDB();

    const user = await User.findOne({
      $or: [
        {
          userName,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      throw new AppError(
        `${
          user.userName === userName ? "L'utilisateur" : "L'adresse mail"
        } existe déjà.`
      );
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
    console.error("Erreur lors de l'inscription :", err);

    if (err instanceof AppError) {
      throw err;
    }

    throw new Error("Une erreur est survenue lors de l'inscription.");
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
