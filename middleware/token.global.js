export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const access_token = useCookie("igdb.access_token").value;

  if (!access_token) {
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    useCookie("igdb.access_token", {
      expires: new Date(Date.now() + data.expires_in),
    }).value = data.access_token;

    navigateTo(to.path);
  }
});
