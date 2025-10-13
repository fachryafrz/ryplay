import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

export async function getAccessToken(event, page) {
  const config = useRuntimeConfig();
  // Cek apakah sudah ada token di cookie
  let token = getCookie(event, IGDB_ACCESS_TOKEN);

  if (!token) {
    // Jika tidak ada, ambil dari API IGDB
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    // Set cookie agar bisa digunakan oleh browser & request berikutnya
    setCookie(event, IGDB_ACCESS_TOKEN, data.access_token, { maxAge: 3600 });

    token = data.access_token;
  }

  // console.log(page, accessToken);

  return token;
}
