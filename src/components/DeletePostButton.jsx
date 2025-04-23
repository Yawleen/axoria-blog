"use client";

import { deletePost } from "@/lib/serverActions/blog/postServerActions";

export default function DeletePostButton({ id }) {
    return (
        <button onClick={() => deletePost(id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded mr-2">
            Supprimer
        </button>
    )
}