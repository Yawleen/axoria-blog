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
            <div className="u-main-container flex flex-wrap gap-4 items-center justify-between py-4">
                <Link href={HOME_ROUTE} className="text-lg font-bold uppercase mr-4 text-zinc-900">Axoria</Link>
                <div className="flex flex-wrap gap-4">
                    <Link href={CATEGORIES_ROUTE} className="text-zinc-900">Catégories</Link>
                    {isAuthenticated.loading && <Image src="/icons/loader.svg" width={24} height={24} alt="" />}

                    {isAuthenticated.isConnected && !isAuthenticated.loading && (
                        <div className="flex gap-x-2 items-center">
                            <Link href={`${DASHBOARD_ROUTE}/create`} className="text-zinc-900">Ajouter un article</Link>
                            <NavbarDropdown userId={isAuthenticated.userId} />
                        </div>
                    )}

                    {!isAuthenticated.isConnected && !isAuthenticated.loading && (
                        <>
                            <Link href={SIGN_UP_ROUTE} className="text-zinc-900 mr-2">S&apos;inscrire</Link>
                            <Link href={SIGN_IN_ROUTE} className="text-zinc-900">Se connecter</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}