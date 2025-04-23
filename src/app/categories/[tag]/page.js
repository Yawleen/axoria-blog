import BlogCard from "@/components/BlogCard";
import { getPostsByTag } from "@/lib/serverMethods/blog/postMethods";

export default async function CategoryPage({ params }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Articles du tag #{tag} 🏷️</h1>
      <p className="t-main-subtitle">
        Tous les articles associés au tag #{tag}
      </p>
      <p className="mr-4 text-md text-zinc-900">Derniers articles</p>

      {posts.length > 0 ? (
        <ul className="u-articles-grid">
          {posts.map((post) => (
            <BlogCard key={post._id} postInfo={post} />
          ))}
        </ul>
      ) : (
        <p>Aucun article trouvé pour ce tag.</p>
      )}
    </main>
  );
}
