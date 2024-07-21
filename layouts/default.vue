<template>
  <div class="flex">
    <aside
      class="bg-neutral sticky top-0 h-screen min-w-[250px] border-r-2 border-secondary"
    >
      <Sidebar />
    </aside>

    <main class="min-h-[300svh] p-4">
      <NuxtPage />
    </main>
  </div>
</template>
