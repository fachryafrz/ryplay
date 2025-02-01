<script setup>
const loadingClass = "animate-pulse bg-gray-400 bg-opacity-20";
</script>

<template>
  <div class="flex items-center gap-2 rounded-xl p-2">
    <span
      :class="`block aspect-poster w-[80px] rounded-md ${loadingClass}`"
    ></span>

    <div class="flex-1">
      <span
        :class="`mb-1 block h-4 w-full max-w-32 rounded ${loadingClass}`"
      ></span>

      <div class="flex flex-col gap-1">
        <span :class="`block h-3 w-full rounded-sm ${loadingClass}`"></span>
        <span
          :class="`block h-3 w-full max-w-[90%] rounded-sm ${loadingClass}`"
        ></span>
      </div>
    </div>
  </div>
</template>
