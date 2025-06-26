export default defineAppConfig({
  name: "Ryplay",
  description:
    "Gaming platform designed to enhance your gaming experience. You can browse, search games with advanced filters and check where a game is available to get/purchase across various game stores. You can also save your favorite games, create a wishlist, and mark games as played.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://ryplay.fachryafrz.com"
      : "http://localhost:3000",
});
