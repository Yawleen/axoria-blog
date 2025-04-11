import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import { notFound } from "next/navigation";

export async function getPost(slug) {
  await connectToDB();

  const post = await Post.findOne({ slug })
    .populate({
      path: "author",
      select: "userName normalizedUserName",
    })
    .populate({
      path: "tags",
      select: "name slug",
    });

  if (!post) return notFound();

  return { success: true, post };
}

export async function getPosts() {
  await connectToDB();

  const posts = await Post.find().populate({
    path: "author",
    select: "userName normalizedUserName",
  });

  return { success: true, posts };
}
