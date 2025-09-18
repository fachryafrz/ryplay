import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, IGDB_ACCESS_TOKEN);
  const { access_token } = event.context;

  const today = dayjs().unix();
  const monthsAgo = dayjs().subtract(1, "month").unix();
  const firstDayOfMonth = dayjs().startOf("month").unix();

  const fetchGames = async (access_token) => {
    const data = await $fetch(`${config.API_URL}/multiquery`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        query games "new-releases" {
          f *, cover.*, artworks.*, screenshots.*;
          w first_release_date <= ${today} & hypes >= 100 & screenshots != null & artworks != null & game_type = 0;
          s first_release_date desc;
          l 20;
        };
        query games "adventure" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & genres.slug = "adventure" & screenshots != null & artworks != null & game_type = 0;
          s hypes desc;
          l 20;
        };
        query games "hack-and-slash-beat-em-up" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & genres.slug = "hack-and-slash-beat-em-up" & screenshots != null & artworks != null & game_type = 0;
          s hypes desc;
          l 20;
        };
        query games "racing" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & genres.slug = "racing" & screenshots != null & artworks != null & game_type = 0 & first_release_date <= ${today};
          s hypes desc;
          l 20;
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
