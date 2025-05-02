"use client";

import Link from "next/link";
import { useRef } from "react";
import { register } from "@/lib/serverActions/session/sessionServerActions";
import { useRouter } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/config/routes";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpPage() {
  const submitButtonRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = "Création de l'utilisateur...";

    const result = await register(formData);

    if (result.success) {
      toast.success("Utilisateur créé avec succès", {
        removeDelay: 3000,
      });
      toast.promise(
        () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 5000);
          }).then(
            router.push(`${SIGN_IN_ROUTE}?pseudo=${formData.get("userName")}`)
          );
        },
        {
          loading: "Redirection vers la page de connexion...",
        }
      );
    } else {
      toast.error(result.message, {
        removeDelay: 4000,
      });
      submitButtonRef.current.textContent = "Soumettre";
      submitButtonRef.current.disabled = false;
    }
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto my-36">
        <label htmlFor="userName" className="f-label">
          Nom ou pseudo
        </label>
        <input
          className="f-auth-input"
          type="text"
          id="userName"
          name="userName"
          placeholder="Nom ou pseudo"
          required
        />

        <label htmlFor="email" className="f-label">
          E-mail
        </label>
        <input
          className="f-auth-input"
          type="email"
          id="email"
          name="email"
          placeholder="E-mail"
          required
        />

        <label htmlFor="password" className="f-label">
          Mot de passe
        </label>
        <input
          className="f-auth-input"
          type="password"
          id="password"
          name="password"
          placeholder="Mot de passe"
          required
        />

        <label htmlFor="passwordRepeat" className="f-label">
          Confirmation du mot de passe
        </label>
        <input
          className="f-auth-input"
          type="password"
          id="passwordRepeat"
          name="passwordRepeat"
          placeholder="Confirmation du mot de passe"
          required
        />

        <button
          ref={submitButtonRef}
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold
        py-3 px-4 my-10 rounded border-none"
        >
          Soumettre
        </button>
        <Link
          href="/signin"
          className="underline text-blue-600 block text-center"
        >
          Vous avez déjà un compte ? Connectez-vous
        </Link>
      </form>
    </>
  );
}
