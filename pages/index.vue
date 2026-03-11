<script setup>
const appConfig = useAppConfig();
const router = useRouter();

const { data: home, status: statusHome } = await useFetch("/api/home");

const featured = computed(
  () => home.value?.find((res) => res.name === "featured")?.result,
);
const upcoming = computed(
  () => home.value?.find((res) => res.name === "upcoming")?.result,
);
const topRated = computed(
  () => home.value?.find((res) => res.name === "top-rated")?.result,
);
const mostAnticipated = computed(
  () => home.value?.find((res) => res.name === "most-anticipated")?.result,
);
</script>

<template>
  <h1 class="sr-only">{{ appConfig.name }}</h1>

  <div
    v-if="statusHome !== 'success'"
    class="grid h-[calc(100dvh-72px-193px)] place-content-center md:h-[calc(100dvh-72px-120px)]"
  >
    <Logo width="50" height="50" class="animate-ping" />
  </div>

  <div v-if="statusHome === 'success'" class="mx-auto flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featured" />
    </section>

    <ClientOnly>
      <HomeClientSections
        :upcoming="upcoming"
        :top-rated="topRated"
        :most-anticipated="mostAnticipated"
      />
    </ClientOnly>
  </div>
</template>
