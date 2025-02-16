<script setup>
const handleOpenWindow = async (url) => {
  // NOTE: Already tried the documentPictureInPicture with iframe but it doesn't work, because most of the website refuse to be embeded in iframe

  const width =
    screen.availWidth < 1024 ? 600 : screen.availWidth < 1280 ? 1024 : 1200;
  const height = screen.availHeight < 600 ? screen.availHeight : 600;
  const left = (screen.availWidth - width) / 2;
  const top = (screen.availHeight - height) / 2;

  const windowFeatures = `left=${left},top=${top},width=${width},height=${height},noreferrer,noopener`;

  window.open(url, "gameStoreWindow", windowFeatures);
};
</script>

<template>
  <button
    @click="handleOpenWindow('https://www.buymeacoffee.com/fachryafrz')"
    target="_blank"
    class="btn px-0 overflow-hidden"
  >
    <img
      src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
      alt="Buy Me A Coffee"
      draggable="false"
    />
  </button>
</template>
