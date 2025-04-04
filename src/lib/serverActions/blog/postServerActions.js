"use server";

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";

export async function addPost(formData) {
  const { title, markdownArticle } = Object.fromEntries(formData);

  try {
    await connectToDB();

    const newPost = new Post({
      title,
      markdownArticle,
    });

    const savedPost = await newPost.save();
    console.log("Post sauvegardé avec succès.");
    return { success: true, slug: savedPost.slug };
  } catch (err) {
    console.log(
      "Une erreur est survenue au moment de la création du post :",
      err
    );
    throw new Error(err.message || "Une erreur est survenue au moment de la création du post.");
  }
}
