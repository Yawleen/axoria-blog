"use client";

import { login } from "@/lib/serverActions/session/sessionServerActions";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { HOME_ROUTE } from "@/config/routes";

export default function SignInPage() {
  const serverInfoRef = useRef(null);
  const submitButtonRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    serverInfoRef.current.textContext = "";
    submitButtonRef.current.disabled = true;

    try {
      const result = await login(formData);

      if (result.success) {
        router.push(HOME_ROUTE);
      }
    } catch (error) {
      submitButtonRef.current.textContent = "Soumettre";
      serverInfoRef.current.textContent = `${error.message}`;
      submitButtonRef.current.disabled = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-36">
      <label htmlFor="userName" className="f-label">
        Pseudo
      </label>
      <input
        type="text"
        className="f-auth-input"
        id="userName"
        name="userName"
        required
        placeholder="Pseudo"
      />

      <label htmlFor="password" className="f-label">
        Mot de passe
      </label>
      <input
        type="password"
        className="f-auth-input"
        id="password"
        name="password"
        required
        placeholder="Mot de passe"
      />
      <p
        ref={serverInfoRef}
        className="font-semibold text-red-500 text-center"
      ></p>

      <button
        ref={submitButtonRef}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold
     py-3 px-4 mt-6 mb-10 rounded border-none"
      >
        Soumettre
      </button>
    </form>
  );
}
