/** Lowercase and strip Slovenian diacritics so "šum" matches "sum". */
export function normalizeSl(value: string): string {
  return value
    .toLowerCase()
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
