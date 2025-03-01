import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await getAccessToken(event, "streams");

  const { game_id, language } = getQuery(event);

  try {
    const { data, status } = await axios.get(
      `https://api.twitch.tv/helix/streams`,
      {
        headers: {
          "CLIENT-ID": config.CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
        },
        params: { game_id, type: "live", language },
      },
    );

    return Response.json(data, { status });
  } catch (error) {
    return Response.json(error.response.data, {
      status: error.response.status,
    });
  }
});
