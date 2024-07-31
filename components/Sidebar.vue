<script setup>
const route = useRoute();

const isActive = ref(false);

const handleActive = () => {
  isActive.value = !isActive.value;
};

const navigation = [
  { name: "Home", link: "/", icon: "home" },
  { name: "Discover Games", link: "/search", icon: "explore" },
  // { name: "My Games", link: "/my-games", icon: "sports_esports" },
  // { name: "Cart", link: "/cart", icon: "shopping_cart" },
  // { name: "Community", link: "/community", icon: "groups" },
  // { name: "Settings", link: "/settings", icon: "settings" },
];

const config = useRuntimeConfig();
</script>

<template>
  <div class="drawer xl:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content p-4">
      <!-- Page content here -->
      <label
        for="my-drawer-2"
        @click="handleActive"
        class="btn btn-primary drawer-button fixed right-4 top-4 z-[100] aspect-square p-0 xl:hidden"
        :class="{ hidden: isActive }"
      >
        <span class="material-symbols-outlined"> menu </span>
      </label>

      <slot />
    </div>

    <aside
      class="drawer-side z-[100] xs:min-w-[250px] xl:top-4 xl:mt-4 xl:max-h-[calc(100dvh-2rem)] xl:rounded-r-xl xl:outline xl:outline-secondary"
    >
      <label
        for="my-drawer-2"
        aria-label="close sidebar"
        class="drawer-overlay"
        @click="handleActive"
      ></label>
      <div
        class="menu min-h-full gap-4 bg-neutral bg-opacity-95 p-4 text-base-content backdrop-blur"
      >
        <div
          class="flex items-center justify-start xl:h-[75px] xl:justify-center"
        >
          <NuxtLink
            to="/"
            class="flex h-[48px] items-center gap-2 !bg-transparent"
          >
            <svg
              id="logo-86"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="ccustom"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25.5557 11.6853C23.9112 10.5865 21.9778 10 20 10V0C23.9556 0 27.8224 1.17298 31.1114 3.37061C34.4004 5.56823 36.9638 8.69181 38.4776 12.3463C39.9913 16.0008 40.3874 20.0222 39.6157 23.9018C38.844 27.7814 36.9392 31.3451 34.1421 34.1421C31.3451 36.9392 27.7814 38.844 23.9018 39.6157C20.0222 40.3874 16.0008 39.9913 12.3463 38.4776C8.69181 36.9638 5.56823 34.4004 3.37061 31.1114C1.17298 27.8224 0 23.9556 0 20H10C10 21.9778 10.5865 23.9112 11.6853 25.5557C12.7841 27.2002 14.3459 28.4819 16.1732 29.2388C18.0004 29.9957 20.0111 30.1937 21.9509 29.8078C23.8907 29.422 25.6725 28.4696 27.0711 27.0711C28.4696 25.6725 29.422 23.8907 29.8078 21.9509C30.1937 20.0111 29.9957 18.0004 29.2388 16.1732C28.4819 14.3459 27.2002 12.7841 25.5557 11.6853Z"
                fill="#FFFFFF"
              ></path>
              <path
                class="ccustom"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 5.16562e-07C10 1.31322 9.74135 2.61358 9.2388 3.82683C8.73625 5.04009 7.99966 6.14248 7.07107 7.07107C6.14249 7.99966 5.0401 8.73625 3.82684 9.2388C2.61358 9.74134 1.31322 10 5.4439e-06 10L5.00679e-06 20C2.62644 20 5.22716 19.4827 7.65368 18.4776C10.0802 17.4725 12.285 15.9993 14.1421 14.1421C15.9993 12.285 17.4725 10.0802 18.4776 7.65367C19.4827 5.22715 20 2.62643 20 -3.81469e-06L10 5.16562e-07Z"
                fill="#FFFFFF"
              ></path>
            </svg>
            <span class="text-2xl font-bold">
              {{ config.public.APP_NAME }}
            </span>
          </NuxtLink>
        </div>

        <div class="mt-4 xl:hidden">
          <SearchBar />
        </div>

        <ul>
          <li v-for="nav in navigation">
            <NuxtLink
              :to="nav.link"
              class="btn btn-ghost justify-start text-base"
              :class="{
                'bg-secondary': route.path === nav.link,
              }"
            >
              <span class="material-symbols-outlined"> {{ nav.icon }} </span>
              <span class="text-sm font-medium">{{ nav.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
