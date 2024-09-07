import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const access_token = getCookie(event, "igdb.access_token");

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
          f *, cover.*, artworks.*,  screenshots.*, genres.*;
          w cover != null & first_release_date >= ${monthsAgo} & first_release_date <= ${today} & hypes >= 10 & category = 0;
          s first_release_date asc;
          l 5;
        };
        query games "upcoming" {
          f *, cover.*, artworks.*;
          w cover != null & first_release_date >= ${today} & hypes >= 30 & category = 0;
          s first_release_date asc;
          l 5;
        };
        query games "top-rated" {
          f *, cover.*, artworks.*;
          w cover != null & category = 0;
          s total_rating_count desc;
          l 20;
        };
        query popularity_primitives "popularity-data" {
          f game_id; 
          w popularity_type = 1;
          s value desc; 
          l 500;  
        };
        query popularity_primitives "most-played-data" {
          f game_id; 
          w popularity_type = 4;
          s value desc; 
          l 500;  
        };
        query popularity_primitives "playing-data" {
          f game_id; 
          w popularity_type = 3;
          s value desc; 
          l 500;  
        };
        query popularity_primitives "want-to-play-data" {
          f game_id; 
          w popularity_type = 2;
          s value desc; 
          l 500;  
        };
      `,
    });

    return data;
  };

  try {
    return await fetchGames(access_token);
  } catch (error) {
    console.error("Error saat mengambil data:", error);
  }
});
