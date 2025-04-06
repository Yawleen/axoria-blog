import Link from "next/link";

export default function SignUpPage() {
  return (
    <form className="max-w-md mx-auto my-36">
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
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold
       py-3 px-4 my-10 rounded border-none"
      >
        Soumettre
      </button>
      <p className="hidden text-center mb-10"></p>
      <Link
        href="/signin"
        className="underline text-blue-600 block text-center"
      >
        Vous avez déjà un compte ? Connectez-vous
      </Link>
    </form>
  );
}
