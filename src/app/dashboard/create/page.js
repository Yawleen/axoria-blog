"use client";

import { addPost } from "@/lib/serverActions/blog/postServerActions";

export default function CreateArticlePage() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = await addPost(formData);
  };

  return (
    <main className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Rédiger un article</h1>

      <form onSubmit={handleSubmit} className="pb-6">
        <label htmlFor="title" className="f-label">
          Titre
        </label>
        <input
          type="text"
          name="title"
          className="shadow border rounded w-full p-3 mb-7 text-gray-700"
          id="title"
          placeholder="Titre"
          required
        />
        <label htmlFor="markdownArticle" className="f-label">
          Rédiger votre article avec markdown (inutile de répéter le titre)
        </label>
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          className="block mb-4 text-blue-600"
        >
          Comment utiliser la syntaxe markdown ?
        </a>
        <textarea
          name="markdownArticle"
          id="markdownArticle"
          className="min-h-44 text-xl shadow appearance-none border rounded w-full p-8 text-gray-700 mb-4 focus:outline-slate-400"
          required
        ></textarea>
        <button className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded border-none mb-4">
          Soumettre
        </button>
      </form>
    </main>
  );
}
