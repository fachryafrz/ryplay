import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const today = dayjs().unix();
  const monthsAgo = dayjs().subtract(1, "month").unix();
  const firstDayOfMonth = dayjs().startOf("month").unix();

  const fetchGames = async (access_token) => {
    const combinedData = [];

    const data1 = await $fetch("https://api.igdb.com/v4/multiquery", {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        query games "featured" {
          f *, cover.*, artworks.*,  screenshots.*, genres.*;
          w cover != null & first_release_date >= ${monthsAgo} & first_release_date <= ${today} & hypes >= 20 & category = 0;
          s first_release_date asc;
          l 5;
        };
        query games "upcoming" {
          f *, cover.*, artworks.*;
          w cover != null & first_release_date >= ${today} & hypes >= 30 & category = 0;
          s first_release_date asc;
          l 4;
        };
        query popularity_primitives "popularity-data" {
          f game_id; 
          w popularity_type = 1;
          s value desc; 
          l 500;  
        };
        query games "top-rated" {
          f *, cover.*, artworks.*;
          w cover != null & category = 0;
          s total_rating_count desc;
          l 20;
        };
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
    // NOTE: Masih 9 request yg ini

    const data2 = await $fetch("https://api.igdb.com/v4/multiquery", {
      method: "POST",
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
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

    return combinedData.concat(data1, data2);
  };

  try {
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
