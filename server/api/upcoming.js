import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await getAccessToken();

  const today = dayjs().unix();

  const fetchGames = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f *, cover.*, artworks.*, screenshots.*;
        w cover != null & screenshots != null & artworks != null & first_release_date >= ${today} & hypes >= 50 & game_type = 0;
        s first_release_date asc;
        l 8;
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
