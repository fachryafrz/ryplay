<script setup>
const navigation = [
  { name: "Home", link: "/" },
  { name: "Discover Games", link: "/discover" },
];
</script>

<template>
  <nav class="flex flex-col gap-4 p-4">
    <NuxtLink to="/" class="!bg-transparent text-3xl font-bold">
      GameCove
    </NuxtLink>

    <ul>
      <li v-for="nav in navigation">
        <NuxtLink :to="nav.link" class="btn btn-ghost w-full justify-start">
          <span>{{ nav.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
