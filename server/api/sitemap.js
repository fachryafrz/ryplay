export default defineSitemapEventHandler(async (e) => {
  const [games] = await Promise.all([
    $fetch("/api/multiquery").then((multiqueryResponse) => {
      const featuredGames = multiqueryResponse.find(
        (res) => res.name === "featured",
      ).result;
      const upcomingGames = multiqueryResponse.find(
        (n) => n.name === `upcoming`,
      ).result;
      const topRatedGames = multiqueryResponse.find(
        (res) => res.name === "top-rated",
      ).result;
      const newReleases = multiqueryResponse.find(
        (res) => res.name === "new-releases",
      ).result;
      const mostAnticipated = multiqueryResponse.find(
        (res) => res.name === "most-anticipated",
      ).result;

      const combinedData = [];

      featuredGames.map((g) => {
        combinedData.push({
          _path: `/games/${g.slug}`,
          modifiedAt: new Date(),
        });
      });
      upcomingGames.map((g) => {
        combinedData.push({
          _path: `/games/${g.slug}`,
          modifiedAt: new Date(),
        });
      });
      topRatedGames.map((g) => {
        combinedData.push({
          _path: `/games/${g.slug}`,
          modifiedAt: new Date(),
        });
      });
      newReleases.map((g) => {
        combinedData.push({
          _path: `/games/${g.slug}`,
          modifiedAt: new Date(),
        });
      });
      mostAnticipated.map((g) => {
        combinedData.push({
          _path: `/games/${g.slug}`,
          modifiedAt: new Date(),
        });
      });

      return combinedData;
    }),
  ]);
  return games.map((p) => {
    return {
      loc: p._path,
      lastmod: p.modifiedAt,
      priority: 0.8,
      changefreq: "hourly",
    };
  });
});
