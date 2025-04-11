import { ARTICLE_ROUTE, CATEGORIES_ROUTE } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ postInfo }) {
    return (
        <li
            className="rounded-sm border shadow-md hover:shadow-xl border-zinc-300"
        >
            <Link href={`${ARTICLE_ROUTE}/${postInfo.slug}`}>
                <Image
                    src={postInfo.imageURL}
                    width={340}
                    height={190}
                    alt={`Image de description de l'article : ${postInfo.title}`}
                    className="w-full rounded-t-sm object-cover"
                />
            </Link>
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
                        href={`${CATEGORIES_ROUTE}/author/${postInfo.author.normalizedUserName}`}
                        className="ml-auto text-base text-gray-700 hover:text-gray-600 whitespace-nowrap truncate"
                    >
                        {postInfo.author.userName}
                    </Link>
                </div>
                <Link
                    href={`${ARTICLE_ROUTE}/${postInfo.slug}`}
                    className="inline-block mt-6 text-xl font-semibold text-zinc-800 hover:text-zinc-600"
                >
                    {postInfo.title}
                </Link>
            </div>
        </li>
    )
}