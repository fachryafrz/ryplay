export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const { slug } = getQuery(event);

  const data = await $fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "CLIENT-ID": config.CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
    body: `
      f *, screenshots.*, cover.*, artworks.*, involved_companies.*, involved_companies.company.*, platforms.*, genres.*, videos.*, similar_games.*, similar_games.name, similar_games.cover.*, collection.*, collection.games.name, collection.games.slug, collection.games.cover.image_id;
      w slug = "${slug}";
    `,
  });

  return data;
});
