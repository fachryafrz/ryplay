import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = await $fetch("/api/token");

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
    offset,
  } = getQuery(event);

  const isThereAnyFilter = Object.keys(getQuery(event)).length > 0;
  const monthsAgo = dayjs().subtract(1, "month").unix();

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

  const fetchCompanyGames = async (access_token) => {
    const separatedItem = company
      .split(",")
      .map((i) => `"${i}"`)
      .join(",");

    const data = await $fetch(`${config.API_URL}/companies`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f developed.slug, developed.cover.image_id, developed.category;
        w slug = (${separatedItem});
        l ${company.split(",").length};
      `,
    });

    const games = data.map((company) => {
      return company.developed.map((game) => {
        return {
          ...game,
          cover: {
            image_id: game.cover ? game.cover.image_id : null,
          },
          category: game.category,
        };
      });
    });

    return games.flat();
  };

  const fetchGames = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/games`, {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        f *, cover.image_id, genres.name, platforms.name;
        ${query ? `search "${query}";` : `s ${sort ? sort : `hypes desc`};`}
        ${isThereAnyFilter ? `w ${whereClause};` : `w first_release_date >= ${monthsAgo};`}
        l 20;
        ${offset ? `o ${offset};` : ""}
      `,
    });

    return data;
  };

  try {
    // Kirim permintaan ke API IGDB
    if (company) return await fetchCompanyGames(access_token);

    return await fetchGames(access_token);
  } catch (error) {
    return Response.json(
      { error: error.response },
      { status: error.response.status },
    );
  }
});
