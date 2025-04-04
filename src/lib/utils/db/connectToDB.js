import mongoose from "mongoose";

export async function connectToDB() {
  if (mongoose.connection.readyState) {
    console.log("Utilisation de la connexion existante.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connecté.");
  } catch {
    throw new Error("Echec de la connexion à la DB.");
  }
}
