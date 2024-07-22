<script setup>
useHead({
  meta: [
    {
      name: "description",
      content: "GameCove is a platform for discovering new games.",
    },
  ],
});

onMounted(async () => {
  const response = await $fetch("/api/token");
  console.log(response);
});
</script>

<template>
  <section>
    <div>
      <h2 class="text-2xl font-bold">Featured Content</h2>
    </div>
  </section>
  <section>
    <div>
      <h2 class="text-2xl font-bold">Top Picks For You</h2>
      <p class="text-sm text-neutral-500">
        Discover games curated only for you
      </p>
    </div>
  </section>
  <section>
    <div>
      <h2 class="text-2xl font-bold">Top Deals For You</h2>
      <p class="text-sm text-neutral-500">Get best discounts on best games</p>
    </div>
  </section>
</template>
