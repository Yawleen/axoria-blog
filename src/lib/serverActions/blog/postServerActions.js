"use server";

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import slugify from "slugify";

export async function addPost(formData) {
  const { title, markdownArticle, tags } = Object.fromEntries(formData);

  try {
    await connectToDB();

    const tagNamesArray = JSON.parse(tags);

    const tagIds = await Promise.all(
      tagNamesArray.map(async (tagName) => {
        const normalizedTagName = tagName.trim().toLowerCase();

        let tag = await Tag.findOne({ name: normalizedTagName });

        if (!tag) {
          tag = await Tag.create({
            name: normalizedTagName,
            slug: slugify(normalizedTagName, { strict: true }),
          });
        }

        return tag._id;
      })
    );

    const newPost = new Post({
      title,
      markdownArticle,
      tags: tagIds,
    });

    const savedPost = await newPost.save();
    console.log("Post sauvegardé avec succès.");
    return { success: true, slug: savedPost.slug };
  } catch (err) {
    console.log(
      "Une erreur est survenue au moment de la création du post :",
      err
    );
    throw new Error(
      err.message || "Une erreur est survenue au moment de la création du post."
    );
  }
}
