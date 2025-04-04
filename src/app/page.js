import { CATEGORIES_ROUTE, ARTICLE_ROUTE } from "@/config/routes";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import Link from "next/link";

const posts = [
  {
    author: "John Doe",
    title: "5 CSS tricks",
  },
  {
    author: "Victor Wallas",
    title: "How to code a navbar",
  },
  {
    author: "Bruce Willis",
    title: "How to setup TypeScript",
  },
];

export default async function Home() {
  await connectToDB();
  
  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Restez à jour avec Axoria Blog</h1>
      <p className="t-main-subtitle">Actualités tech et savoirs utiles</p>

      <p className="text-md text-zinc-900">Derniers articles</p>
      <ul className="u-articles-grid">
        {posts.map((post, i) => (
          <li
            key={i}
            className="rounded-sm border shadow-md hover:shadow-xl hover:border-zinc-300"
          >
            <div className="pt-5 px-5 pb-7">
              <div className="flex items-baseline gap-x-4 text-xs">
                <time
                  dateTime={new Date().toISOString()}
                  className="text-gray-500 text-sm"
                >
                  {new Date().toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <Link
                  href={`${CATEGORIES_ROUTE}/author/${post.author}`}
                  className="ml-auto text-base text-gray-700 hover:text-gray-600 whitespace-nowrap truncate"
                >
                  {post.author}
                </Link>
              </div>
              <Link
                href={`${ARTICLE_ROUTE}/${post.title}`}
                className="inline-block mt-6 text-xl font-semibold text-zinc-800 hover:text-zinc-600"
              >
                {post.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
