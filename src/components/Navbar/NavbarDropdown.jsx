"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DASHBOARD_ROUTE } from "@/config/routes";

export default function NavbarDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const handleLogout = () => { };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!dropdownRef.current.contains(e.target)) {
                closeDropdown();
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={toggleDropdown} className="flex">
                <Image
                    src="/icons/user.svg"
                    alt="Mon compte"
                    width={18}
                    height={18}
                />
            </button>
            {isOpen && (
                <ul className="absolute right-0 top-9.5 w-[250px] border-b border-x border-zinc-300">
                    <li
                        className="bg-slate-50 hover:bg-slate-200">
                        <Link onClick={closeDropdown} href={DASHBOARD_ROUTE} className="block p-4">
                            Dashboard
                        </Link>
                    </li>
                    <li className="bg-slate-50 hover:bg-slate-200">
                        <button onClick={handleLogout} className="w-full p-4 text-left">
                            Se déconnecter
                        </button>
                    </li>
                </ul>
            )}
        </div>
    )
}