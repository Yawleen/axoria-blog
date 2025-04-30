"use client";

import { HOME_ROUTE } from "@/config/routes";
import Link from "next/link";

export default function Error() {
  return (
    <div className="pt-44 text-center">
      <h1 className="text-4xl mb-4">Une erreur serveur est survenue.</h1>
      <Link href={HOME_ROUTE} className="underline">
        Retourner à la page d&apos;accueil
      </Link>
    </div>
  );
}
