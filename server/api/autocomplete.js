import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, IGDB_ACCESS_TOKEN);

  const { query } = getQuery(event);

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f *, cover.image_id, genres.name, platforms.name;
        w name ~ *"${query}"* | slug ~ *"${query.replace(/ /g, "-")}"*;
        l 10;
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
