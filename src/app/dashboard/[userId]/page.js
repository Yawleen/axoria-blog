import Link from "next/link";
import { ARTICLE_ROUTE, DASHBOARD_ROUTE } from "@/config/routes";

export default async function UserDashboardPage({ params }) {
  const { userId } = await params;
  const posts = [
    {
      _id: "1234",
      title: "Deuxième article",
      slug: "deuxieme-article",
    },
  ];

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
                className="mr-auto underline underline-offset-2 text-violet-600"
              >
                {post.title}
              </Link>
              <div className="flex gap-x-2">
                <button>Supprimer</button>
                <Link
                  href={`${DASHBOARD_ROUTE}/edit/${post.slug}`}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded"
                >
                  Éditer
                </Link>
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
