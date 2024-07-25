export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const { slug, id, sort, limit } = getQuery(event);

  let whereClause = "";

  if (slug) whereClause += `slug = "${slug}"`;
  if (id) whereClause += `id = ${id}`;

  try {
    const data = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
      f *, screenshots.image_id, cover.image_id, artworks.image_id, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, platforms.abbreviation, genres.name, videos.video_id, similar_games.slug, similar_games.name, similar_games.cover.image_id, collection.name, collection.games.name, collection.games.slug, collection.games.cover.image_id, external_games.category, external_games.url, bundles.*, bundles.cover.*, dlcs.*, dlcs.cover.*, collections.*, collections.games.*, collections.games.cover.*;
      w ${whereClause};
      ${sort ? `s ${sort};` : "s total_rating_count desc;"}
      ${limit ? `l ${limit};` : "l 1;"}
    `,
    });

    return data;
  } catch (error) {
    if (error.status === 401) {
      console.error("Error saat mengambil data:", error);

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
        return await $fetch("https://api.igdb.com/v4/games", {
          method: "POST",
          headers: {
            "CLIENT-ID": config.CLIENT_ID,
            Authorization: `Bearer ${newAccessToken}`,
          },
          body: `
          f *, screenshots.image_id, cover.image_id, artworks.image_id, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, platforms.abbreviation, genres.name, videos.video_id, similar_games.slug, similar_games.name, similar_games.cover.image_id, collection.name, collection.games.name, collection.games.slug, collection.games.cover.image_id, external_games.category, external_games.url, bundles.*, bundles.cover.*, dlcs.*, dlcs.cover.*, collections.*, collections.games.*, collections.games.cover.*;
          w ${whereClause};
          ${sort ? `s ${sort};` : "s total_rating_count desc;"}
          ${limit ? `l ${limit};` : "l 1;"}
        `,
        });
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
