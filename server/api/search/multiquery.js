import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, "igdb.access_token");

  const today = dayjs().unix();
  const monthsAgo = dayjs().subtract(1, "month").unix();
  const firstDayOfMonth = dayjs().startOf("month").unix();

  const fetchGames = async (access_token) => {
    const combinedData = [];

    const data = await $fetch(`${config.API_URL}/multiquery`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        query genres "genres" {
          f *;
          s name asc;
          l 500;
        };
        query platforms "platforms" {
          f *;
          s name asc;
          l 500;
        };
        query themes "themes" {
          f *;
          s name asc;
          l 500;
        };
        query game_modes "game-modes" {
          f *;
          l 500;
        };
        query player_perspectives "player-perspectives" {
          f *;
          l 500;
        };
      `,
    });
    return data;
  };

  try {
    return await fetchGames(access_token);
  } catch (error) {
    return Response.json(
      { error: error.response },
      { status: error.response.status },
    );
  }
});
