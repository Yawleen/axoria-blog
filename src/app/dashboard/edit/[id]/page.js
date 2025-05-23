import { getPostForEdit } from "@/lib/serverMethods/blog/postMethods";
import ClientEditForm from "@/components/ClientEditForm";
import { Types } from "mongoose";

export default async function EditPage({ params }) {
  const { id } = await params;
  const post = await getPostForEdit(id);
  const serializablePost = JSON.parse(
    JSON.stringify(post, (key, value) =>
      value instanceof Types.ObjectId ? value.toString() : value
    )
  );

  return <ClientEditForm post={serializablePost} />;
}
