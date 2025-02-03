export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const newToken = await $fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    params: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  return { access_token: newToken };
});
