export default defineEventHandler(async (event) => {
  const access_token = getCookie(event, IGDB_ACCESS_TOKEN);

  if (!access_token && event.path.startsWith("/api/")) {
    const config = useRuntimeConfig();

    const response = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    setCookie(event, IGDB_ACCESS_TOKEN, response.access_token, {
      maxAge: 3600,
      path: "/",
      secure: true,
    });

    // Inject token agar bisa dipakai di API
    event.context.access_token = response.access_token;
  } else {
    event.context.access_token = access_token;
  }
});
