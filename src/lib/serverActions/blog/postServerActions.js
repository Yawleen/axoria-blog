"use server";

import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import slugify from "slugify";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import Prism from "prismjs";
import { markedHighlight } from "marked-highlight";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import AppError from "@/lib/utils/errorHandling/customError";
import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods";
import { revalidatePath } from "next/cache";
import { areTagsSimilar, generateUniqueSlug } from "@/lib/utils/general/utils";
import { findOrCreateTag } from "@/lib/serverMethods/tag/tagMethods";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function addPost(formData) {
  const { title, markdownArticle, tags, imageURL } =
    Object.fromEntries(formData);

  try {
    if (typeof title !== "string" || title.trim().length < 3) {
      throw new AppError("Titre invalide.");
    }

    if (
      typeof markdownArticle !== "string" ||
      markdownArticle.trim().length === 0
    ) {
      throw new AppError("Markdown invalide.");
    }

    if (typeof imageURL !== "string") {
      throw new AppError("URL invalide.");
    }

    await connectToDB();

    const session = await sessionInfo();

    if (!session.success) {
      throw new AppError("Authentification requise.");
    }

    if (typeof tags !== "string") {
      throw new AppError("Données invalides.");
    }

    const tagNamesArray = JSON.parse(tags);
    if (!Array.isArray(tagNamesArray)) {
      throw new AppError("Les tags doivent être un tableau valide.");
    }

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

    marked.use(
      markedHighlight({
        highlight: (code, language) => {
          const validLanguage = Prism.languages[language]
            ? language
            : "plaintext";
          return Prism.highlight(
            code,
            Prism.languages[validLanguage],
            validLanguage
          );
        },
      })
    );

    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: false,
      mangle: false,
    });

    let markdownHTMLResult = marked(markdownArticle);

    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult);

    const newPost = new Post({
      title,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds,
      imageURL,
      author: session.userId,
    });

    const savedPost = await newPost.save();
    console.log("Post sauvegardé avec succès.");
    return { success: true, slug: savedPost.slug };
  } catch (err) {
    console.error("Erreur lors de la création du post :", err);

    if (err instanceof AppError) {
      return { success: false, message: err.message };
    }

    return {
      success: false,
      message: "Une erreur est survenue lors de la création du post.",
    };
  }
}

export async function editPost(formData) {
  const { postToEditStringified, title, markdownArticle, tags, imageURL } =
    Object.fromEntries(formData);
  const postToEdit = JSON.parse(postToEditStringified);

  try {
    await connectToDB();

    const session = await sessionInfo();

    if (!session.success) {
      throw new Error();
    }

    const updatedData = {};

    if (typeof title !== "string") throw new Error();
    if (title.trim() !== postToEdit.title) {
      updatedData.title = title;
      updatedData.slug = await generateUniqueSlug(title);
    }

    if (typeof markdownArticle !== "string") throw new Error();
    if (markdownArticle.trim() !== postToEdit.markdownArticle) {
      updatedData.markdownHTMLResult = DOMPurify.sanitize(
        marked(markdownArticle)
      );
      updatedData.markdownArticle = markdownArticle;
    }

    if (typeof imageURL !== "string") throw new Error();
    if (imageURL) {
      updatedData.imageURL = imageURL;
    }

    if (typeof tags !== "string") throw new Error();

    const tagNamesArray = JSON.parse(tags);
    if (!Array.isArray(tagNamesArray)) throw new Error();

    if (!areTagsSimilar(tagNamesArray, postToEdit.tags)) {
      const tagIds = await Promise.all(
        tagNamesArray.map((tag) => findOrCreateTag(tag))
      );
      updatedData.tags = tagIds;
    }

    if (Object.keys(updatedData).length === 0) throw new Error();

    const updatedPost = await Post.findByIdAndUpdate(
      postToEdit._id,
      updatedData,
      { new: true }
    );

    revalidatePath(`/article/${postToEdit.slug}`);

    return { success: true, slug: updatedPost.slug };
  } catch (err) {
    console.error("Erreur lors de la modification du post :", err);

    if (err instanceof AppError) {
      return { success: false, message: err.message };
    }

    return {
      success: false,
      message: "Une erreur est survenue lors de la modification du post.",
    };
  }
}

export async function deletePost(id) {
  try {
    await connectToDB();

    const session = await sessionInfo();
    if (!session) {
      throw new AppError("Authentification requise.");
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError("Le post n'a pas été trouvé.");
    }

    await Post.findByIdAndDelete(id);
    revalidatePath(`/article/${post.slug}`);
  } catch (err) {
    console.error("Erreur lors de la suppression du post :", err);

    if (err instanceof AppError) {
      return { success: false, message: err.message };
    }

    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression du post.",
    };
  }
}
