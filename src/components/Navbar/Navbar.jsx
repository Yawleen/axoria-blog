"use client";

import Link from "next/link"
import { HOME_ROUTE, CATEGORIES_ROUTE, DASHBOARD_ROUTE, SIGN_UP_ROUTE, SIGN_IN_ROUTE } from "@/config/routes"
import NavbarDropdown from "./NavbarDropdown";
import { useAuth } from "@/app/AuthContext";
import Image from "next/image";

export default function Navbar() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300 z-[999]">
            <div className="u-main-container flex items-center py-4">
                <Link href={HOME_ROUTE} className="uppercase mr-4 text-zinc-900">Axoria</Link>
                <Link href={CATEGORIES_ROUTE} className="text-zinc-900 mr-auto">Catégories</Link>

                {isAuthenticated.loading && (
                    <div className="">
                        <Image src="/icons/loader.svg" width={24} height={24} alt="" />
                    </div>
                )}

                {isAuthenticated.isConnected && !isAuthenticated.loading && (
                    <>
                        <Link href={`${DASHBOARD_ROUTE}/create`} className="text-zinc-900 mr-2">Ajouter un article</Link>
                        <NavbarDropdown userId={isAuthenticated.userId} />
                    </>
                )}

                {!isAuthenticated.isConnected && !isAuthenticated.loading && (
                    <>
                        <Link href={SIGN_UP_ROUTE} className="text-zinc-900 mr-2">S'inscrire</Link>
                        <Link href={SIGN_IN_ROUTE} className="text-zinc-900">Se connecter</Link>
                    </>
                )}
            </div>
        </nav>
    )
}