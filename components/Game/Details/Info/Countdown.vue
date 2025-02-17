<script setup>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import pluralize from "pluralize";

const { game } = defineProps(["game"]);

dayjs.extend(duration); // Extend dayjs dengan plugin duration

const releaseDate = dayjs.unix(game.first_release_date); // Mengonversi Unix timestamp ke Day.js
const isUpcoming = dayjs().isBefore(releaseDate); // Cek apakah game belum dirilis

// State untuk menyimpan nilai countdown
const countdown = ref({
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

// Fungsi untuk menghitung waktu yang tersisa
const calculateTimeLeft = () => {
  const now = dayjs(); // Waktu saat ini
  const timeLeft = dayjs.duration(releaseDate.diff(now)); // Menggunakan dayjs.duration

  if (timeLeft.asSeconds() < 0) return;

  // Mengambil hari, jam, menit, dan detik dengan metode duration
  countdown.value.years = timeLeft.years();
  countdown.value.months = timeLeft.months();
  countdown.value.days = timeLeft.days();
  countdown.value.hours = timeLeft.hours();
  countdown.value.minutes = timeLeft.minutes();
  countdown.value.seconds = timeLeft.seconds();
};

// Jalankan fungsi `calculateTimeLeft` ketika komponen di-mount
onMounted(() => {
  calculateTimeLeft(); // Hitung waktu yang tersisa pada saat pertama kali komponen di-mount

  // Perbarui countdown setiap detik
  const interval = setInterval(calculateTimeLeft, 1000);

  // Bersihkan interval ketika komponen di-unmount
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <div
    v-if="isUpcoming"
    class="flex flex-wrap justify-center gap-2 text-center"
  >
    <div
      v-if="countdown.years > 0"
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.years }"></span>
      </span>
      {{ pluralize("year", countdown.years) }}
    </div>
    <div
      v-if="countdown.months > 0"
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.months }"></span>
      </span>
      {{ pluralize("month", countdown.months) }}
    </div>
    <div
      v-if="countdown.days > 0"
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.days }"></span>
      </span>
      {{ pluralize(`day`, countdown.days) }}
    </div>
    <div
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.hours }"></span>
      </span>
      {{ pluralize(`hour`, countdown.hours) }}
    </div>
    <div
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.minutes }"></span>
      </span>
      min
    </div>
    <div
      class="flex flex-col rounded-box bg-neutral p-2 text-neutral-content outline outline-secondary"
    >
      <span class="countdown font-mono text-5xl">
        <span :style="{ '--value': countdown.seconds }"></span>
      </span>
      sec
    </div>
  </div>
</template>
