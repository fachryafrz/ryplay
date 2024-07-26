import { defineEventHandler, parseCookies, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  // Dapatkan query dari URL
  const { query, rating, genre, platform, release_date } = getQuery(event);

  // Membuat bagian where clause
  let whereClause = "cover != null";

  if (rating) whereClause += ` & total_rating >= ${parseFloat(rating)}`;
  if (genre) whereClause += ` & genres.slug = "${genre}"`;
  if (platform) whereClause += ` & platforms.slug = "${platform}"`;
  if (release_date) {
    // const [startDate, endDate] = release_date.split(",");
    // whereClause += ` & first_release_date >= ${parseInt(startDate)} & first_release_date <= ${parseInt(endDate)}`;
    whereClause += ` & first_release_date >= ${parseInt(release_date)}`;
  }

  const fetchGames = async (access_token) => {
    const data = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: `
        f name, slug, cover.image_id, first_release_date, total_rating, genres.name, platforms.name;
        ${query ? `search "${query}";` : "s total_rating_count desc;"}
        w ${whereClause};
        l 50;
      `,
    });

    return data;
  };

  try {
    // Kirim permintaan ke API IGDB
    return await fetchGames(access_token);
  } catch (error) {
    console.error("Error saat mengambil data:", error);

    if (error.status === 401) {
      deleteCookie(event, "access_token");

      try {
        const newTokenResponse = await $fetch(
          "https://id.twitch.tv/oauth2/token",
          {
            method: "POST",
            params: {
              client_id: config.CLIENT_ID,
              client_secret: config.CLIENT_SECRET,
              grant_type: "client_credentials",
            },
          },
        );
        const newAccessToken = newTokenResponse.access_token;

        // Simpan token baru di cookies
        setCookie(event, "access_token", newAccessToken, {
          expires: new Date(Date.now() + 3600 * 1000), // Misalnya 1 jam
        });

        // Ulangi permintaan dengan token baru
        return await fetchGames(newAccessToken);
      } catch (tokenError) {
        console.error("Gagal mendapatkan token baru:", tokenError);
        throw createError({
          statusCode: 500,
          statusMessage: "Gagal mendapatkan token baru setelah error 401.",
        });
      }
    } else {
      throw error; // Lemparkan kesalahan lainnya untuk penanganan lebih lanjut
    }
  }
});
