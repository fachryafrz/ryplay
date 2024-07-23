import { defineEventHandler, parseCookies, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  // Dapatkan query dari URL
  const { query, rating, genre, platform, release_date } = getQuery(event);

  // Membuat bagian where clause
  let whereClause = "cover != null";

  if (query) whereClause += ` & name ~ *"${query}"*`;
  if (rating) whereClause += ` & total_rating >= ${parseFloat(rating)}`;
  if (genre) whereClause += ` & genres.slug = "${genre}"`;
  if (platform) whereClause += ` & platforms.slug = "${platform}"`;
  if (release_date) {
    // const [startDate, endDate] = release_date.split(",");
    // whereClause += ` & first_release_date >= ${parseInt(startDate)} & first_release_date <= ${parseInt(endDate)}`;
    whereClause += ` & first_release_date >= ${parseInt(release_date)}`;
  }

  try {
    // Kirim permintaan ke API IGDB
    const data = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: `
        f name, slug, cover.image_id, first_release_date, total_rating, genres.name, platforms.name;
        w ${whereClause};
        s total_rating_count desc;
        l 20;
      `,
    });

    return data;
  } catch (error) {
    console.error("Error fetching data from IGDB:", error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
