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
        w first_release_date <= ${today} & hypes >= 100 & screenshots != null & artworks != null & game_type = 0;
        s first_release_date desc;
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
