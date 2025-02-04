import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

export default function useAccessTokenExpired() {
  const token = useCookie(IGDB_ACCESS_TOKEN);

  // Gunakan computed untuk mengecek apakah token kosong (expired)
  const isExpired = computed(() => !token.value);

  watch(isExpired, async () => await refreshNuxtData());

  // return isExpired;
}
