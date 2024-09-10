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
        query games "most-anticipated" {
          f *, cover.*, artworks.*;
          w first_release_date >= ${today} & hypes >= 40 & screenshots != null & artworks != null & category = 0;
          s hypes desc;
          l 20;
        };
        query games "new-releases" {
          f *, cover.*, artworks.*;
          w first_release_date <= ${today} & hypes >= 10 & category = 0;
          s first_release_date desc;
          l 20;
        };
        query games "adventure" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "adventure" & screenshots != null & artworks != null & category = 0;
          s total_rating_count desc;
          l 20;
        };
        query games "shooter" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "shooter" & screenshots != null & artworks != null & category = 0;
          s total_rating_count desc;
          l 20;
        };
        query games "racing" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "racing" & screenshots != null & artworks != null & category = 0;
          s total_rating_count desc;
          l 20;
        };
        query games "sports" {
          f *, cover.*, artworks.*;
          w cover != null & genres = 14 & screenshots != null & artworks != null & category = 0;
          s total_rating_count desc;
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
