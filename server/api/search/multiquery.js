import dayjs from "dayjs";
import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, IGDB_ACCESS_TOKEN);
  const access_token = await $fetch("/api/token", {
    params: { access_token: cookie },
  });

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
