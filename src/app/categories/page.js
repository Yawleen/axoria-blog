import { getTags } from "@/lib/serverMethods/blog/tagMethods";
import Link from "next/link";
import { CATEGORIES_ROUTE } from "@/config/routes";

export default async function CategoriesPage() {
  const tags = await getTags();

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Toutes les catégories</h1>
      <p className="t-main-subtitle">Les articles triés par catégorie</p>
      {tags.length > 0 ? (
        <ul className="u-articles-grid">
          {tags.map((tag) => (
            <li key={tag._id} className="bg-gray-100 border rounded shadow-md">
              <Link
                href={`${CATEGORIES_ROUTE}/${tag.slug}`}
                className="flex flex-wrap p-4 pb-6 gap-2 justify-between items-baseline"
              >
                <span className="w-[50%] shrink-0 wrap-break-word text-lg underline font-semibold">
                  #{tag.name}
                </span>
                <span>
                  Nb d'articles :{" "}
                  <span className="font-semibold">{tag.postCount}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas de catégorie trouvée.</p>
      )}
    </main>
  );
}
