<script setup>
const appConfig = useAppConfig();
const router = useRouter();

const { data: home, status: statusHome } = await useFetch("/api/home");

const featured = computed(
  () => home.value?.find((res) => res.name === "featured")?.result,
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
      <HomeClientSections />
    </ClientOnly>
  </div>
</template>
