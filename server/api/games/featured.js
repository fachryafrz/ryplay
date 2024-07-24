import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const access_token = cookies?.access_token;

  const firstDayOfMonth = dayjs().startOf("month").unix();

  const data = await $fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "CLIENT-ID": config.CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
    body: `
        f *, screenshots.image_id, cover.image_id, artworks.image_id, genres.name;
        w cover != null & first_release_date >= ${firstDayOfMonth};
        s rating desc;
        l 4;
      `,
  });

  return data;
});
