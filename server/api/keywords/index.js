export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const { name } = getQuery(event);
  const { body } = await readBody(event);

  const fetchGame = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/keywords`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: body,
    });

    return data;
  };

  try {
    return await fetchGame(access_token);
  } catch (error) {
    if (error.status === 401) {
      console.error("Error saat mengambil data:", error);

      deleteCookie(event, "access_token");

      try {
        const newTokenResponse = await $fetch(
          "https://id.twitch.tv/oauth2/token",
          {
            method: "POST",
            params: {
              client_id: config.CLIENT_ID,
              client_secret: config.CLIENT_SECRET,
              grant_type: "client_credentials",
            },
          },
        );
        const newAccessToken = newTokenResponse.access_token;

        // Simpan token baru di cookies
        setCookie(event, "access_token", newAccessToken, {
          expires: new Date(Date.now() + 3600 * 1000), // Misalnya 1 jam
        });

        // Ulangi permintaan dengan token baru
        return await fetchGame(newAccessToken);
      } catch (tokenError) {
        console.error("Gagal mendapatkan token baru:", tokenError);
        throw createError({
          statusCode: 500,
          statusMessage: "Gagal mendapatkan token baru setelah error 401.",
        });
      }
    } else {
      throw error; // Lemparkan kesalahan lainnya untuk penanganan lebih lanjut
    }
  }
});
