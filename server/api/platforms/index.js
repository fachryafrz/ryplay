export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, "igdb.access_token");

  const { name } = getQuery(event);
  const { body } = await readBody(event);

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/platforms`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: body,
    });

    return data;
  };

  try {
    return await fetchGame(access_token);
  } catch (error) {
    console.error("Error saat mengambil data:", error);
  }
});
