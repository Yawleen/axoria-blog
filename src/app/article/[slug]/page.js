import { getPost } from "@/lib/serverMethods/blog/postMethods";
import { CATEGORIES_ROUTE } from "@/config/routes";
import Link from "next/link";
import "./article-styles.css";
import "prism-themes/themes/prism-atom-dark.css";
import Image from "next/image";

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const { post } = await getPost(slug);

  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="text-4xl mb-3">{post.title}</h1>
      <p className="mb-6">
        Par{" "}
        <Link
          href={`${CATEGORIES_ROUTE}/author/${post.author.normalizedUserName}`}
        >
          {post.author.userName}
        </Link>
      </p>
      <div className="mb-6">
        {post.tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`${CATEGORIES_ROUTE}/tag/${tag.slug}`}
            className="mr-4 underline"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
      <Image
        src={post.imageURL}
        width={1280}
        height={720}
        alt={post.title}
        className="mb-10"
      />
      <div
        className="article-styles"
        dangerouslySetInnerHTML={{ __html: post.markdownHTMLResult }}
      ></div>
    </main>
  );
}
