"use server";

export async function getImagesFromPexels(keyword) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${keyword}&orientation=landscape&size=medium&per_page=20`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.photos;
}
