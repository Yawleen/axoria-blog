"use client";

import { login } from "@/lib/serverActions/session/sessionServerActions";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { HOME_ROUTE } from "@/config/routes";
import { useAuth } from "@/app/AuthContext";

export default function SignInPage() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const serverInfoRef = useRef(null);
  const submitButtonRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    serverInfoRef.current.textContext = "";
    serverInfoRef.current.classList.add("hidden");
    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = "Connexion en cours...";

    setIsAuthenticated({
      ...isAuthenticated,
      loading: true,
    });

    try {
      const result = await login(formData);

      if (result.success) {
        setIsAuthenticated({
          loading: false,
          isConnected: result.success,
          userId: result.userId,
        });
        router.push(HOME_ROUTE);
        return;
      }
    } catch (error) {
      serverInfoRef.current.textContent = `${error.message}`;
      serverInfoRef.current.classList.remove("hidden");
      submitButtonRef.current.textContent = "Soumettre";
      submitButtonRef.current.disabled = false;
    }

    setIsAuthenticated({
      ...isAuthenticated,
      loading: false,
    });

    window.scrollTo(0, document.body.scrollHeight);
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
        className="hidden font-semibold text-red-500 text-center"
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
