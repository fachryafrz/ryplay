export function isPlural(count, singularText, pluralText) {
  return count <= 1 ? singularText : pluralText;
}
