<script setup>
import numeral from "numeral";
import pluralize from "pluralize";

const { stream } = defineProps(["stream"]);

const handleOpenWindow = async (url, target = "_blank") => {
  // NOTE: Already tried the documentPictureInPicture with iframe but it doesn't work, because most of the website refuse to be embeded in iframe

  const width = screen.availWidth < 1024 ? screen.availWidth : 1024;
  const height = screen.availHeight < 600 ? screen.availHeight : 600;
  const left = (screen.availWidth - width) / 2;
  const top = (screen.availHeight - height) / 2;

  const windowFeatures = `left=${left},top=${top},width=${width},height=${height},noreferrer,noopener`;

  window.open(url, target, windowFeatures);
};
</script>

<template>
  <button
    @click="
      handleOpenWindow(`https://www.twitch.tv/${stream.user_login}`, '_blank')
    "
    class="group overflow-hidden rounded-xl"
  >
    <div class="relative flex flex-col gap-2">
      <!-- Image -->
      <figure>
        <img
          :src="stream.thumbnail_url.replace(/\{width\}x\{height\}/, '640x360')"
          alt=""
          class="transition-all duration-500 group-hover:scale-105"
        />
      </figure>

      <!-- Info -->
      <div
        class="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/80 via-25% p-2"
      >
        <div class="flex justify-between">
          <!-- Live -->
          <div
            class="btn btn-ghost no-animation btn-sm pointer-events-none bg-[#9146FF] uppercase text-white"
          >
            <Icon name="ion:radio" size="20" />

            <span>{{ stream.type }}</span>
          </div>

          <!-- Views -->
          <span class="btn btn-neutral no-animation btn-sm pointer-events-none">
            {{
              `${numeral(stream.viewer_count).format("0.[0]a")} ${pluralize("View", stream.viewer_count)}`
            }}
          </span>
        </div>

        <!-- Title -->
        <div class="space-y-2">
          <div
            class="flex flex-col items-start gap-1 text-start text-sm font-medium"
          >
            <span class="block text-xs">{{
              $dayjs(stream.started_at).fromNow()
            }}</span>

            <span class="block text-primary">{{ stream.user_name }}</span>
          </div>

          <h3 class="line-clamp-2 max-w-[80%] text-pretty text-start font-bold">
            {{ stream.title }}
          </h3>
        </div>
      </div>
    </div>
  </button>
</template>
