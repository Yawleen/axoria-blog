import BlogCard from "@/components/BlogCard";
import { getPostsByAuthor } from "@/lib/serverMethods/blog/postMethods";

export default async function AuthorPage({ params }) {
  const { author } = await params;
  const data = await getPostsByAuthor(author);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Articles de {data.author.userName}</h1>
      <p className="t-main-subtitle">
        Tous les articles associés à l'auteur {data.author.userName}
      </p>
      <p className="mr-4 text-md text-zinc-900">Derniers articles</p>

      {data.posts.length > 0 ? (
        <ul className="u-articles-grid">
          {data.posts.map((post) => (
            <BlogCard key={post._id} postInfo={post} />
          ))}
        </ul>
      ) : (
        <p>Aucun article trouvé pour cet auteur.</p>
      )}
    </main>
  );
}
