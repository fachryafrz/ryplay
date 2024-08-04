<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const router = useRouter();
const route = useRoute();

const dayjs = useDayjs();
const today = dayjs();
const endOfNextYear = today.add(1, "year").endOf("year");
const fromDate = ref(today);
const toDate = ref(endOfNextYear);

const handleReleaseDateParams = () => {
  const formattedFromDate = dayjs(fromDate.value).unix();
  const formattedToDate = dayjs(toDate.value).unix();

  router.push({
    path: "/search",
    query: {
      ...route.query,
      release_date: `${formattedFromDate}..${formattedToDate}`,
      sort: `${route.query.sort || "hypes desc"}`,
    },
  });
};
const handleFromDate = (data) => {
  fromDate.value = data;

  handleReleaseDateParams();
};
const handleToDate = (data) => {
  toDate.value = data;

  handleReleaseDateParams();
};

const format = (date) => {
  const day = dayjs(date).format("DD");
  const month = dayjs(date).format("MMM");
  const year = dayjs(date).format("YYYY");

  return `${day} ${month} ${year}`;
};

watch(
  () => route.query,
  (searchParams) => {
    if (searchParams.release_date) {
      const [from, to] = searchParams.release_date.split("..");

      fromDate.value = dayjs.unix(from);
      toDate.value = dayjs.unix(to);
    } else {
      fromDate.value = today;
      toDate.value = endOfNextYear;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <VueDatePicker
      v-model="fromDate"
      :esc-close="true"
      :format="format"
      :dark="true"
      :enable-time-picker="false"
      @date-update="handleFromDate"
      :clearable="false"
      hide-input-icon="true"
      class="[&_input]:text-center [&_input]:text-sm [&_input]:font-medium"
      style="--dp-input-padding: 0.5rem"
      :max-date="endOfNextYear"
      position="left"
    />

    <span>-</span>

    <VueDatePicker
      v-model="toDate"
      :esc-close="true"
      :format="format"
      :dark="true"
      :enable-time-picker="false"
      @date-update="handleToDate"
      :clearable="false"
      hide-input-icon="true"
      class="[&_input]:text-center [&_input]:text-sm [&_input]:font-medium"
      style="--dp-input-padding: 0.5rem"
      :max-date="endOfNextYear"
      position="right"
    />
  </div>
</template>
