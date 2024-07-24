// Cache untuk menyimpan hasil pengecekan URL gambar
const imageCache = new Map();

// Fungsi untuk memeriksa ketersediaan gambar
const checkImage = async (url) => {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  try {
    const response = await fetch(url, { method: "HEAD" });
    const result = response.ok;
    imageCache.set(url, result);
    return result;
  } catch (error) {
    imageCache.set(url, false);
    return false;
  }
};

// Fungsi untuk mendapatkan URL thumbnail yang valid
export const getValidThumbnail = async (videoId) => {
  const possibleThumbnails = [
    `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
    `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];

  for (const url of possibleThumbnails) {
    if (await checkImage(url)) {
      return url;
    }
  }

  return "https://via.placeholder.com/1280x720?text=No+Thumbnail";
};
