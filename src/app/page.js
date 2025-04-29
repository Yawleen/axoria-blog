import Link from "next/link";
import { getPosts } from "@/lib/serverMethods/blog/postMethods";
import BlogCard from "@/components/BlogCard";
import { DASHBOARD_ROUTE } from "@/config/routes";

export const revalidate = 60;

export default async function Home() {
  const { posts } = await getPosts();

  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Restez à jour avec Axoria Blog</h1>
      <p className="t-main-subtitle">Actualités tech et savoirs utiles</p>

      <p className="text-md text-zinc-900 mb-4">Derniers articles</p>
      {posts?.length > 0 ? (
        <ul className="u-articles-grid">
          {posts.map((post, i) => (
            <BlogCard key={i} postInfo={post} />
          ))}
        </ul>
      ) : (
        <>
          <p className="text-lg text-center font-semibold">
            Aucun article disponible pour le moment
          </p>
          <Link
            href={`${DASHBOARD_ROUTE}/create`}
            className="block text-center underline"
          >
            Créez un premier article
          </Link>
        </>
      )}
    </div>
  );
}
