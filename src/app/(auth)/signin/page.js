export default function SignInPage() {
  return (
    <form className="max-w-md mx-auto mt-36">
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

      <button
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold
     py-3 px-4 mt-6 mb-10 rounded border-none"
      >
        Soumettre
      </button>
      <p className="text-center mb-10"></p>
    </form>
  );
}
