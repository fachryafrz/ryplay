import dayjs from "dayjs";

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
    const data = await $fetch(`${config.API_URL}/multiquery`, {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
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
        query popularity_primitives "popularity-data" {
          f game_id; 
          w popularity_type = 1;
          s value desc; 
          l 20;  
        };
        query popularity_primitives "most-played-data" {
          f game_id; 
          w popularity_type = 4;
          s value desc; 
          l 10;  
        };
        query popularity_primitives "playing-data" {
          f game_id; 
          w popularity_type = 3;
          s value desc; 
          l 10;  
        };
        query popularity_primitives "want-to-play-data" {
          f game_id; 
          w popularity_type = 2;
          s value desc; 
          l 10;  
        };
      `,
    });

    const popularityData = data.find(
      (res) => res.name === "popularity-data",
    ).result;
    const mostPlayedData = data.find(
      (res) => res.name === "most-played-data",
    ).result;
    const playingData = data.find((res) => res.name === "playing-data").result;
    const wantToPlayData = data.find(
      (res) => res.name === "want-to-play-data",
    ).result;

    const groupedPopularityData = popularityData
      .map((data) => data.game_id)
      .join(",");
    const groupedMostPlayedData = mostPlayedData
      .map((data) => data.game_id)
      .join(",");
    const groupedPlayingData = playingData
      .map((data) => data.game_id)
      .join(",");
    const groupedWantToPlayData = wantToPlayData
      .map((data) => data.game_id)
      .join(",");

    const fetchGameDetails = async (id, sort, limit) => {
      return await $fetch("/api/games/details", {
        params: { id, sort, limit },
      });
    };

    const adventure = data.find((res) => res.name === "adventure").result;
    const hackAndSlashBeatEmUp = data.find(
      (res) => res.name === "hack-and-slash-beat-em-up",
    ).result;
    const racing = data.find((res) => res.name === "racing").result;
    const sport = data.find((res) => res.name === "sport").result;
    const popular = await fetchGameDetails(
      groupedPopularityData,
      "hypes desc",
      20,
    );
    const mostPlayed = await fetchGameDetails(
      groupedMostPlayedData,
      "hypes desc",
      10,
    );
    const playing = await fetchGameDetails(
      groupedPlayingData,
      "hypes desc",
      10,
    );
    const wantToPlay = await fetchGameDetails(
      groupedWantToPlayData,
      "hypes desc",
      10,
    );

    return {
      adventure,
      hackAndSlashBeatEmUp,
      racing,
      sport,
      popular,
      mostPlayed,
      playing,
      wantToPlay,
    };
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
