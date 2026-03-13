export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await getAccessToken();

  const fetchGames = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/multiquery`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        query games "top-rated" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & game_type = 0 & screenshots != null & artworks != null;
          s total_rating_count desc;
          l 20;
        };
      `,
    });

    return data;
  };

  try {
    return await fetchGames(access_token);
  } catch (error) {
    return Response.json(
      { error: error?.response },
      { status: error?.response?.status || 500 },
    );
  }
});
