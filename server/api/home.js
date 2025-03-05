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
        query games "featured" {
          f *, cover.*, artworks.*, screenshots.*, genres.*;
          w cover != null & screenshots != null & artworks != null & first_release_date >= ${monthsAgo} & first_release_date <= ${today} & hypes >= 10 & category = 0;
          s first_release_date asc;
          l 5;
        };
        query games "upcoming" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & screenshots != null & artworks != null & first_release_date >= ${today} & hypes >= 30 & category = 0;
          s first_release_date asc;
          l 5;
        };
        query games "top-rated" {
          f *, cover.*, artworks.*, screenshots.*;
          w cover != null & category = 0 & screenshots != null & artworks != null;
          s total_rating_count desc;
          l 20;
        };
        query games "most-anticipated" {
          f *, cover.*, artworks.*, screenshots.*;
          w first_release_date >= ${today} & hypes >= 40 & screenshots != null & artworks != null & category = 0;
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
