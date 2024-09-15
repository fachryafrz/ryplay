import { IGDB_ACCESS_TOKEN } from "../utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, IGDB_ACCESS_TOKEN);
  const { client_id, client_secret, grant_type } = getQuery(event);

  const data = await $fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    params: { client_id, client_secret, grant_type },
  });

  return data;
});
