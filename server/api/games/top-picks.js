export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const data = await $fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "CLIENT-ID": config.CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
    body: `
      f name, storyline, summary, screenshots.*, cover.*, artworks.*, slug;
      w cover != null;
      s total_rating_count desc;
      l 20;
    `,
  });

  return data;
});
