import dayjs from "dayjs";
import { IGDB_ACCESS_TOKEN } from "../utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, IGDB_ACCESS_TOKEN);

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
          s hypes desc;
          l 20;
        };
        query games "hack-and-slash-beat-em-up" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "hack-and-slash-beat-em-up" & screenshots != null & artworks != null & category = 0;
          s hypes desc;
          l 20;
        };
        query games "racing" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "racing" & screenshots != null & artworks != null & category = 0;
          s hypes desc;
          l 20;
        };
        query games "sport" {
          f *, cover.*, artworks.*;
          w cover != null & genres.slug = "sport" & screenshots != null & artworks != null & category = 0;
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
