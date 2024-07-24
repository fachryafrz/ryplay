export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;
  const { clearCookie } = getQuery(event);

  if (clearCookie) deleteCookie(event, "access_token");

  if (!access_token) {
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    setCookie(event, "access_token", data.access_token, {
      expires: new Date(Date.now() + data.expires_in),
    });
  }
});
