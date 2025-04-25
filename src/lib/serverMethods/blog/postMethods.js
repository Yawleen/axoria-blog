import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/lib/models/post";
import { Tag } from "@/lib/models/tag";
import { notFound } from "next/navigation";
import { User } from "@/lib/models/user";

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

export async function getUserPostsFromUserID(userId) {
  await connectToDB();

  const posts = await Post.find({
    author: userId,
  }).select("title _id slug");

  return posts;
}

export async function getPostsByTag(tagSlug) {
  await connectToDB();

  const tag = await Tag.findOne({
    slug: tagSlug,
  });

  if (!tag) {
    notFound();
  }

  const posts = await Post.find({ tags: tag._id })
    .populate({
      path: "author",
      select: "userName normalizedUserName",
    })
    .select("title imageURL slug createdAt")
    .sort({ createdAt: -1 });

  return posts;
}

export async function getPostsByAuthor(normalizedUserName) {
  await connectToDB();

  const author = await User.findOne({
    normalizedUserName,
  });

  if (!author) {
    notFound();
  }

  const posts = await Post.find({ author: author._id })
    .populate({
      path: "author",
      select: "userName normalizedUserName",
    })
    .select("title imageURL slug createdAt")
    .sort({ createdAt: -1 });

  return { author, posts };
}
