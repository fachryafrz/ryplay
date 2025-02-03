export async function getAccessToken(event) {
  const config = useRuntimeConfig();
  // Cek apakah sudah ada token di cookie
  let accessToken = getCookie(event, IGDB_ACCESS_TOKEN);

  if (!accessToken) {
    // Jika tidak ada, ambil dari API IGDB
    const { access_token } = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      params: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    // Set cookie agar bisa digunakan oleh browser & request berikutnya
    setCookie(event, IGDB_ACCESS_TOKEN, access_token, { maxAge: 3600 });

    accessToken = access_token;
  }

  return accessToken;
}
