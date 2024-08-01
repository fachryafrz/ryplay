export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const { slug, id, sort, limit } = getQuery(event);

  let whereClause = "cover != null";

  if (slug) whereClause += ` & slug = "${slug}"`;
  if (id) whereClause += ` & id = (${id})`;

  const fetchGame = async (access_token) => {
    const data = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
      f *, screenshots.*, cover.*, artworks.*, involved_companies.*, involved_companies.company.*, platforms.*, genres.*, videos.*, similar_games.*, similar_games.cover.*, collection.*, collection.games.*, collection.games.cover.*, external_games.*, bundles.*, bundles.cover.*, dlcs.*, dlcs.cover.*, collections.*, collections.games.*, collections.games.cover.*;
      w ${whereClause};
      ${sort ? `s ${sort};` : "s total_rating_count desc;"}
      ${limit ? `l ${limit};` : "l 1;"}
    `,
    });

    return data;
  };

  try {
    return await fetchGame(access_token);
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
        return await fetchGame(newAccessToken);
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
