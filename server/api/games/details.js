export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, "igdb.access_token");

  const { slug, id, sort, limit } = getQuery(event);

  let whereClause = "cover != null";

  if (slug) whereClause += ` & slug = "${slug}"`;
  if (id) whereClause += ` & id = (${id})`;

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
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
    console.error("Error saat mengambil data:", error);
  }
});
