import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await getAccessToken();

  const today = dayjs().unix();

  const fetchData = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f *, cover.*, artworks.*, screenshots.*;
        w cover != null & genres.slug = "racing" & screenshots != null & artworks != null & game_type = 0 & first_release_date <= ${today};
        s hypes desc;
        l 20;
      `,
    });

    return data;
  };

  try {
    return await fetchData(access_token);
  } catch (error) {
    return Response.json(
      { error: error?.response || error },
      { status: error?.response?.status || 500 },
    );
  }
});
