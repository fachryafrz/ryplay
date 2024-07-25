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
      f *, screenshots.image_id, cover.image_id, artworks.image_id, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, platforms.abbreviation, genres.name, videos.video_id, similar_games.slug, similar_games.name, similar_games.cover.image_id, collection.name, collection.games.name, collection.games.slug, collection.games.cover.image_id, external_games.category, external_games.url;
      w ${whereClause};
      ${sort ? `s ${sort};` : "s total_rating_count desc;"}
      ${limit ? `l ${limit};` : "l 1;"}
    `,
    });

    return data;
  } catch (error) {
    if (error.status === 401) {
      deleteCookie(event, "access_token");

      return error;
    }
  }
});
