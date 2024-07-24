import numeral from "numeral";

export function formatRating(rating) {
  return rating ? (rating / 10).toFixed(1) : "N/A";
}

export function formatNumber(number) {
  return numeral(number).format("0.[0]a").toUpperCase();
}
