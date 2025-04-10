import Link from "next/link";
import { HOME_ROUTE } from "@/config/routes";

export default function NotFoundPage() {
  return (
    <div className="pt-44 text-center">
      <h1 className="text-4xl mb-4">404 - Page introuvable.</h1>
      <p className="mb-2">La ressource demandée est introuvable.</p>
      <Link href={HOME_ROUTE} className="underline">
        Retourner à la page d'accueil
      </Link>
    </div>
  );
}
