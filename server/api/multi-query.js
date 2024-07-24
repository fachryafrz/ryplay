import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const today = dayjs().unix();
  const firstDayOfMonth = dayjs().startOf("month").unix();

  try {
    const data = await $fetch("https://api.igdb.com/v4/multiquery", {
      method: "POST",
      headers: {
        "CLIENT-ID": config.CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
      body: `
        query games "upcoming" {
          f *, screenshots.image_id, cover.image_id, artworks.image_id, genres.name;
          w cover != null & first_release_date >= ${today} & hypes >= 30;
          s first_release_date asc;
          l 5;
        };

        query games "featured" {
          f *, screenshots.image_id, cover.image_id, artworks.image_id, genres.name;
          w cover != null & first_release_date >= ${firstDayOfMonth} & first_release_date <= ${today} & hypes >= 20;
          s first_release_date asc;
          l 4;
        };

        query games "top-picks" {
          f name, storyline, summary, screenshots.image_id, cover.image_id, artworks.image_id, slug;
          w cover != null;
          s total_rating_count desc;
          l 20;
        };
      `,
    });

    return data;
  } catch (error) {
    if (error.status === 401) {
      deleteCookie(event, "access_token");

      return error;
    }
  }
});
