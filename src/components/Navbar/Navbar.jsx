import Link from "next/link"
import { HOME_ROUTE, CATEGORIES_ROUTE, DASHBOARD_ROUTE, SIGN_UP_ROUTE, SIGN_IN_ROUTE } from "@/config/routes"
import { sessionInfo } from "@/lib/serverMethods/session/sessionMethods"

export default async function Navbar() {
    const session = await sessionInfo();

    return (
        <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300">
            <div className="u-main-container flex items-center py-4">
                <Link href={HOME_ROUTE} className="uppercase mr-4 text-zinc-900">Axoria</Link>
                <Link href={CATEGORIES_ROUTE} className="text-zinc-900 mr-auto">Catégories</Link>
                {
                    session.success ? (
                        <Link href={`${DASHBOARD_ROUTE}/create`} className="text-zinc-900">Ajouter un article</Link>
                    ) : (
                        <>
                            <Link href={SIGN_UP_ROUTE} className="text-zinc-900 mr-2">S'inscrire</Link>
                            <Link href={SIGN_IN_ROUTE} className="text-zinc-900">Se connecter</Link>
                        </>
                    )
                }
            </div>
        </nav>
    )
}