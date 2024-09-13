import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const access_token = useCookie(IGDB_ACCESS_TOKEN).value;
  const isApiRoute = to.path.startsWith("/api");

  if (!access_token && !isApiRoute) {
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    useCookie(IGDB_ACCESS_TOKEN, {
      expires: new Date(Date.now() + data.expires_in),
    }).value = data.access_token;

    navigateTo(to.path);
  }
});
