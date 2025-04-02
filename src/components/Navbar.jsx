import Link from "next/link"
import { HOME_ROUTE, CATEGORIES_ROUTE, DASHBOARD_CREATE_ROUTE } from "@/config/routes"

export default function Navbar() {
    return (
        <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300">
            <div className="u-main-container flex py-4">
                <Link href={HOME_ROUTE} className="uppercase mr-2 text-zinc-900">Axoria</Link>
                <Link href={CATEGORIES_ROUTE} className="text-zinc-900 mr-auto">Catégories</Link>
                <Link href={DASHBOARD_CREATE_ROUTE} className="text-zinc-900">Ajouter un article</Link>
            </div>
        </nav>
    )
}