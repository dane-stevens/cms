export function mask(text: string) {
  const unmasked = text.split("_");
  const masked = unmasked[1].slice(-4).padStart(text.length, "*");
  return unmasked[0] + "_" + masked;
}
