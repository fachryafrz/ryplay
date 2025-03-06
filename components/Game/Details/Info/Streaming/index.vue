<script setup>
import axios from "axios";
import pluralize from "pluralize";
import useSWRV from "swrv";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { languages } from "~/data/language";

const { gameId: game_id } = defineProps(["gameId"]);

const route = useRoute();
const language = useSelectedStreamLanguage();
const title = "Live Stream";
const swiperID = title.toLocaleLowerCase().replace(/ /g, "_");
const loading = ref(false);

const fetcher = async (url) => {
  return await axios
    .get(url, { params: { game_id, language: language.value } })
    .then(({ data }) => data);
};

const { data: response, isLoading } = useSWRV(`/api/games/streams`, fetcher, {
  revalidateOnFocus: false,
});
const data = computed(() => response.value?.data);

const selectedStream = useSelectedStream();
const iframeSrc = computed(
  () =>
    `https://player.twitch.tv?channel=${selectedStream.value?.user_login}&parent=${location.hostname}`,
);

const setLanguage = async (lang) => {
  language.value = lang.code;

  try {
    loading.value = true;
    const data = await fetcher(`/api/games/streams`);

    response.value = data;
  } catch (error) {
    console.error("Error fetching:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.path,
  () => {
    selectedStream.value = null;
  },
  { immediate: true },
);
</script>

<template>
  <section class="flex flex-col gap-2 @container">
    <div class="flex items-end justify-between gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <h2 class="heading-2">{{ pluralize(title, data?.length) }}</h2>

        <VueSelect
          v-model="language"
          :options="languages"
          :reduce="(value) => value.code"
          @option:selected="(value) => setLanguage(value)"
          @option:deselected="(value) => setLanguage(value)"
          :clearable="false"
          label="name"
          class="min-w-[100px]"
        />
      </div>

      <div
        v-if="data?.length > 0"
        id="swiper-navigation"
        class="flex h-full gap-1"
      >
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

    <GameDetailsInfoStreamingSkeleton v-if="isLoading || loading" />

    <div v-else-if="data?.length === 0" class="@container">
      <div
        class="mx-auto grid aspect-video max-w-[calc(100%/1.1)] place-content-center @3xl:max-w-[calc(100%/2.1)]"
      >
        No streams found
      </div>
    </div>

    <div
      v-else-if="data?.length > 0"
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
        class="!-mx-4 !px-4 lg:!mx-0 lg:rounded-xl lg:!px-0"
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
    <div class="-mx-4 aspect-video overflow-hidden lg:mx-0 lg:rounded-xl">
      <iframe :src="iframeSrc" height="100%" width="100%" allowfullscreen>
      </iframe>
    </div>
  </section>
</template>
