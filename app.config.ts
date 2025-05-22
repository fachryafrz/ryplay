export default defineAppConfig({
  name: "Glitch",
  description:
    "Glitch is a comprehensive gaming platform designed to enhance your gaming experience. You can browse, search games with advanced filters and check where a game is available to get/purchase across various game stores. You can also save your favorite games, create a wishlist, and mark games as played.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://glitch.fachryafrz.com"
      : "http://localhost:3000",
});
