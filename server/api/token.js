export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, "igdb.access_token");

  if (!access_token) {
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    setCookie(event, "igdb.access_token", data.access_token, {
      expires: new Date(Date.now() + data.expires_in * 1000), // pastikan multiply by 1000 untuk miliseconds
    });
  }
});
