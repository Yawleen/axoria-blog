import Link from "next/link";
import { ARTICLE_ROUTE, DASHBOARD_ROUTE } from "@/config/routes";
import { getUserPostsFromUserID } from "@/lib/serverMethods/blog/postMethods";
import DeletePostButton from "@/components/DeletePostButton";

export default async function UserDashboardPage({ params }) {
  const { userId } = await params;
  const posts = await getUserPostsFromUserID(userId);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="text-3xl mb-5">Dashboard - Vos articles</h1>
      {posts?.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li
              key={post._id}
              className="flex flex-wrap gap-4 items-center mb-2 bg-slate-50 py-3 px-4 rounded"
            >
              <Link
                href={`${ARTICLE_ROUTE}/${post.slug}`}
                className="mr-auto underline underline-offset-2 text-lg text-violet-600"
              >
                {post.title}
              </Link>
              <div className="flex gap-x-2">
                <Link
                  href={`${DASHBOARD_ROUTE}/edit/${post.slug}`}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded"
                >
                  Éditer
                </Link>
                <DeletePostButton id={post._id.toString()} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'avez pas encore créé d'articles.</p>
      )}
    </main>
  );
}
