export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  // Dapatkan query dari URL
  const {
    sort,
    query,
    rating,
    genre,
    platform,
    theme,
    release_date,
    category,
    company,
    id,
    screenshots,
    artworks,
    hypes,
    game_mode,
    player_perspective,
    keyword,
  } = getQuery(event);
  const { offset } = await readBody(event);

  // Membuat bagian where clause
  let whereClause = "cover != null";

  if (rating) whereClause += ` & total_rating >= ${parseFloat(rating)}`;
  if (genre) {
    const separatedItem = genre
      .split(",")
      .map((i) => `"${i}"`)
      .join(",");

    whereClause += ` & genres.slug = (${separatedItem})`;
  }
  if (platform) {
    const separatedItem = platform
      .split(",")
      .map((i) => `"${i}"`)
      .join(",");

    whereClause += ` & platforms.slug = (${separatedItem})`;
  }
  if (theme) {
    const separatedItem = theme
      .split(",")
      .map((i) => `"${i}"`)
      .join(",");

    whereClause += ` & themes.slug = (${separatedItem})`;
  }
  if (release_date) {
    const [startDate, endDate] = release_date.split("..");
    if (!endDate && startDate) {
      whereClause += ` & first_release_date >= ${startDate}`;
    } else if (!startDate && endDate) {
      whereClause += ` & first_release_date <= ${endDate}`;
    } else {
      whereClause += ` & first_release_date >= ${startDate} & first_release_date <= ${endDate}`;
    }
  }
  if (category) {
    const separatedItem = category
      .split(",")
      .map((i) => `${i}`)
      .join(",");

    whereClause += ` & category = (${separatedItem})`;
  }
  if (company)
    whereClause += ` & involved_companies.company.slug = "${company}"`;
  if (id) whereClause += ` & id = (${id})`;
  if (screenshots) whereClause += ` & screenshots != null`;
  if (artworks) whereClause += ` & artworks != null`;
  if (hypes) whereClause += ` & hypes >= ${hypes}`;
  if (game_mode) {
    const separatedItem = game_mode
      .split(",")
      .map((i) => `${i}`)
      .join(",");

    whereClause += ` & game_modes = (${separatedItem})`;
  }
  if (player_perspective) {
    const separatedItem = player_perspective
      .split(",")
      .map((i) => `${i}`)
      .join(",");

    whereClause += ` & player_perspectives = (${separatedItem})`;
  }
  if (keyword) {
    const separatedItem = keyword
      .split(",")
      .map((i) => `"${i}"`)
      .join(",");

    whereClause += ` & keywords.slug = (${separatedItem})`;
  }

  const fetchGames = async (access_token) => {
    const data = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: `
        f *, cover.image_id, genres.name, platforms.name;
        ${query ? `search "${query}";` : `s ${sort ? sort : `total_rating_count desc`};`}
        w ${whereClause};
        l 20;
        ${offset ? `o ${offset};` : ""}
      `,
    });

    return data;
  };

  try {
    // Kirim permintaan ke API IGDB
    return await fetchGames(access_token);
  } catch (error) {
    console.error("Error saat mengambil data:", error);

    if (error.status === 401) {
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
        return await fetchGames(newAccessToken);
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
