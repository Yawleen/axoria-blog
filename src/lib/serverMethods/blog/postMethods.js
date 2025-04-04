import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";

export async function getPost(slug) {
  try {
    await connectToDB();

    const post = await Post.findOne({ slug });
    return { success: true, post };
  } catch (err) {
    console.log(
      "Une erreur est survenue au moment de la récupération du post :",
      err
    );
    throw new Error(
      err.message ||
        "Une erreur est survenue au moment de la récupération du post."
    );
  }
}
