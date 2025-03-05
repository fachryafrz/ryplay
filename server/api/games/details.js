export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { access_token } = event.context;

  const { slug, id, sort, limit } = getQuery(event);

  let whereClause = "name != null";

  if (slug) whereClause += ` & slug = (${slug})`;
  if (id) whereClause += ` & id = (${id})`;

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
      f *, screenshots.*, cover.*, artworks.*, involved_companies.*, involved_companies.company.*, platforms.*, genres.*, videos.*, similar_games.*, similar_games.cover.*, collection.*, collection.games.*, collection.games.cover.*, external_games.*, bundles.*, bundles.cover.*, dlcs.*, dlcs.cover.*, collections.*, collections.games.*, collections.games.cover.*, expansions.*, expansions.cover.*, standalone_expansions.*, standalone_expansions.cover.*, remakes.*, remakes.cover.*, remasters.*, remasters.cover.*, ports.*, ports.cover.*, forks.*, forks.cover.*;
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
    return Response.json(
      { error: error.response },
      { status: error.response.status },
    );
  }
});
