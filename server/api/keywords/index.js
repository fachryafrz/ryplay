export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await getAccessToken();

  const { name, isMulti } = getQuery(event);

  let whereClause;

  if (isMulti === "true") {
    whereClause = `slug = (${name})`;
  } else {
    whereClause = `name ~ *"${name}"* | slug ~ *"${name.replace(/ /g, "-")}"*`;
  }

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/keywords`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f *;
        w ${whereClause};
        s name asc;
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
