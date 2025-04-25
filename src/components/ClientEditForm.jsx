"use client";

import { editPost } from "@/lib/serverActions/blog/postServerActions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ARTICLE_ROUTE } from "@/config/routes";
import { getImagesFromPexels } from "@/lib/serverActions/blog/imagesServerAction";
import { areTagsSimilar } from "@/lib/utils/general/utils";

export default function ClientEditForm({ post }) {
    const tagInput = useRef(null);
    const imageInput = useRef(null);
    const searchImageButton = useRef(null);
    const [tags, setTags] = useState(post.tags.map(tag => tag.name));
    const [tagError, setTagError] = useState("");
    const [imagesError, setImagesError] = useState("");
    const [defaultImage, setDefaultImage] = useState(post.imageURL);
    const [images, setImages] = useState([]);
    const [selectedImageURL, setSelectedImageURL] = useState("");
    const submitButtonRef = useRef(null);
    const serverValidationText = useRef(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const readableFormData = Object.fromEntries(formData);
        const areSameTags = areTagsSimilar(tags, post.tags);

        if (selectedImageURL === "" && readableFormData.title.trim() === post.title && readableFormData.markdownArticle.trim() === post.markdownArticle && areSameTags) {
            serverValidationText.current.textContent = "Vous devez effectuer un changement avant de soumettre.";
            return
        }

        serverValidationText.current.textContent = "";

        formData.set("tags", JSON.stringify(tags));
        formData.set("imageURL", selectedImageURL);
        formData.set("postToEditStringified", JSON.stringify(post));

        serverValidationText.current.textContent = "";
        submitButtonRef.current.textContent = "Modification de l'article...";
        submitButtonRef.current.disabled = true;

        try {
            const result = await editPost(formData);

            if (result.success) {
                submitButtonRef.current.textContent = "Article modifié avec succès";

                let countdown = 3;

                serverValidationText.current.textContent = `Redirection dans ${countdown}...`;

                const interval = setInterval(() => {
                    countdown--;
                    serverValidationText.current.textContent = `Redirection dans ${countdown}...`;

                    if (countdown === 0) {
                        clearInterval(interval);
                        router.push(`${ARTICLE_ROUTE}/${result.slug}`);
                    }
                }, 1000);
            }
        } catch (error) {
            submitButtonRef.current.textContent = "Soumettre";
            serverValidationText.current.textContent = `${error.message}`;
            submitButtonRef.current.disabled = false;
        }
    };

    const addTag = (tag) => {
        if (tags.length < 5) {
            if (!tags.includes(tag)) {
                setTags([...tags, tag]);
                return;
            }

            setTagError("Le tag saisi a déjà été ajouté.");
            return;
        }

        setTagError("Le nombre maximal de tags a été atteint.");
    };

    const removeTag = (tag) => {
        const tagIndex = tags.findIndex((userTag) => userTag === tag);
        const tagsCopy = [...tags];

        tagsCopy.splice(tagIndex, 1);
        setTags(tagsCopy);
    };

    const handleAddTag = () => {
        const tag = tagInput.current.value.trim().toLowerCase();

        if (!tag.length) {
            setTagError("Veuillez saisir un tag avant l'ajout.");
            return;
        }

        if (tagError) {
            setTagError("");
        }

        tagInput.current.value = "";

        addTag(tag);
    };

    const handleEnterOnTagInput = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            handleAddTag();
        }
    };

    const handleSearchImage = async () => {
        const imageInputValue = imageInput.current.value.trim();

        setImages([]);
        setImagesError("");
        imageInput.current.value = "";
        searchImageButton.current.disabled = true;

        if (imageInputValue) {
            const images = await getImagesFromPexels(imageInputValue);

            if (images.length > 0) {
                setImages(images);
            } else {
                setImagesError(
                    "Aucune image n'a été trouvée. Veuillez retaper un autre mot-clé."
                );
            }
        } else {
            setImagesError("Veuillez saisir un mot-clé avant la recherche.");
        }

        searchImageButton.current.disabled = false;
    };

    const handleEnterOnImageInput = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            handleSearchImage();
        }
    };

    const selectImage = (source) => {
        if (defaultImage) {
            setDefaultImage("");
        }

        setSelectedImageURL(source)
    };

    return (
        <main className="u-main-container bg-white p-7 mt-32 mb-44">
            <h1 className="text-4xl mb-4">Éditer un article</h1>

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
                    defaultValue={post.title}
                    required
                />
                <label htmlFor="tag" className="f-label">
                    Ajoutez un ou plusieurs tags (optionnel, 5 max.)
                </label>
                <div className="mb-6">
                    <div className="flex flex-wrap gap-3 mb-2">
                        <input
                            ref={tagInput}
                            onKeyDown={handleEnterOnTagInput}
                            type="text"
                            name="tag"
                            className="shadow border rounded w-[150px] p-3 text-gray-700 focus:outline-slate-400"
                            placeholder="Ajouter un tag"
                            id="tag"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded"
                        >
                            Ajouter
                        </button>
                        <div className="grow shadow border rounded p-3 text-gray-700">
                            <ul className="flex flex-wrap items-center gap-2 min-h-[30px]">
                                {tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="flex items-center gap-x-1 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => removeTag(tag)}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {tagError && (
                        <p className="text-red-600 text-sm font-semibold">{tagError}</p>
                    )}
                </div>
                {defaultImage && (<>
                    <p className="text-sm font-semibold mb-1">Image par défaut :</p>
                    <img src={defaultImage} alt={`Image de l'article ${post.title}`} className="h-[200px] rounded mb-2" />
                </>)}
                <label htmlFor="image" className="f-label">
                    Sélectionnez une image
                </label>
                <div className="mb-6">
                    <div className="flex flex-wrap gap-3 mb-2">
                        <input
                            ref={imageInput}
                            onKeyDown={handleEnterOnImageInput}
                            type="text"
                            name="image"
                            className="grow shadow border rounded p-3 text-gray-700 focus:outline-slate-400"
                            placeholder="Taper un mot-clé pour rechercher des images"
                            id="image"
                        />
                        <button
                            ref={searchImageButton}
                            type="button"
                            onClick={handleSearchImage}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded"
                        >
                            Rechercher
                        </button>
                    </div>
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 max-h-[200px] overflow-y-auto mb-2">
                            {images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.src.medium}
                                    alt={img.alt}
                                    className={`${img.src.large === selectedImageURL
                                        ? "border-indigo-500 scale-105"
                                        : "border-transparent"
                                        } border border-3 w-full h-full object-cover rounded cursor-pointer`}
                                    onClick={() => selectImage(img.src.large)}
                                />
                            ))}
                        </div>
                    )}
                    {imagesError && (
                        <p className="text-red-600 text-sm font-semibold">{imagesError}</p>
                    )}
                </div>
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
                    defaultValue={post.markdownArticle}
                    required
                ></textarea>
                <button
                    ref={submitButtonRef}
                    className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded border-none mb-4"
                >
                    Soumettre
                </button>
                <p className="font-bold" ref={serverValidationText}></p>
            </form>
        </main>
    )
}