import { IGDB_ACCESS_TOKEN } from "../utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, IGDB_ACCESS_TOKEN);

  if (access_token) return access_token;

  const data = await $fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    params: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  // setCookie(event, IGDB_ACCESS_TOKEN, data.access_token, {
  //   expires: new Date(Date.now() + data.expires_in),
  // });

  return data.access_token;
});
