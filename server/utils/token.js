export async function getAccessToken(event, page) {
  const config = useRuntimeConfig();
  let accessToken = getCookie(event, IGDB_ACCESS_TOKEN);

  if (!accessToken) {
    const { access_token } = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    setCookie(event, IGDB_ACCESS_TOKEN, access_token, { maxAge: 3600 });

    accessToken = access_token;
  }

  // console.log("utils/token", page, accessToken);

  return accessToken;
}
