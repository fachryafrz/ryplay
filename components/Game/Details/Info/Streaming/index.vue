<script setup>
import pluralize from "pluralize";

const { externalGames } = defineProps(["gameId", "externalGames"]);

const route = useRoute();
const game_id = externalGames.find((item) => item.category === 14)?.uid; // Twitch Game ID
const title = "Live Stream";
const swiperID = title.toLocaleLowerCase().replace(/ /g, "_");

const { data: response } = await useFetch(`/api/games/streams`, {
  params: { game_id },
});
const data = computed(() => response.value?.data);

const selectedStream = useSelectedStream();
const iframeSrc = computed(
  () =>
    `https://player.twitch.tv?channel=${selectedStream.value?.user_login}&parent=${location.hostname}`,
);

watch(
  () => route.path,
  () => {
    selectedStream.value = null;
  },
  { immediate: true },
);
</script>

<template>
  <section v-if="data?.length > 0" class="flex flex-col gap-2 @container">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="heading-2">{{ pluralize(title, data.length) }}</h2>
      </div>

      <div id="swiper-navigation" class="flex h-full gap-1">
        <button
          class="btn btn-primary btn-sm aspect-square px-0"
          :class="`${swiperID}_prev `"
        >
          <Icon name="ion:md-arrow-dropleft" size="20" />
        </button>
        <button
          class="btn btn-primary btn-sm aspect-square px-0"
          :class="`${swiperID}_next `"
        >
          <Icon name="ion:md-arrow-dropright" size="20" />
        </button>
      </div>
    </div>

    <div
      class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100"
    >
      <Swiper
        :modules="[SwiperNavigation, SwiperFreeMode]"
        :free-mode="true"
        :slides-per-view="`auto`"
        :slides-per-group="1"
        :space-between="8"
        :navigation="{
          prevEl: `.${swiperID}_prev`,
          nextEl: `.${swiperID}_next`,
        }"
        class="rounded-xl"
      >
        <SwiperSlide
          v-for="stream in data"
          :key="stream.id"
          class="max-w-[calc(100%/1.1)] @3xl:max-w-[calc(100%/2.1)]"
        >
          <GameDetailsInfoStreamingCard :stream="stream" />
        </SwiperSlide>
      </Swiper>
    </div>
  </section>

  <!-- Embed -->
  <section v-if="selectedStream">
    <div class="-mx-4 aspect-video overflow-hidden rounded-xl lg:mx-0">
      <iframe :src="iframeSrc" height="100%" width="100%" allowfullscreen>
      </iframe>
    </div>
  </section>
</template>
