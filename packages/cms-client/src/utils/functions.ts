export function checkIsInside(bounds: DOMRect, coordinates: { x: number; y: number }) {
  if (!bounds || !coordinates) return false;
  return bounds.x < coordinates.x &&
    bounds.y < coordinates.y &&
    bounds.x + bounds.width > coordinates.x &&
    bounds.y + bounds.height > coordinates.y
    ? true
    : false;
}

export const THRESHOLD = 20;
export function checkIsNear(bounds: DOMRect, coordinates: { x: number; y: number }) {
  if (!bounds || !coordinates) return false;
  const left = bounds.x - THRESHOLD < 0 ? 0 : bounds.x - THRESHOLD;
  const right = bounds.x + bounds.width + THRESHOLD;
  const top = bounds.y - THRESHOLD < 0 ? 0 : bounds.y - THRESHOLD;
  const bottom = bounds.y + bounds.height + THRESHOLD;
  return left < coordinates.x &&
    right > coordinates.x &&
    top < coordinates.y &&
    bottom > coordinates.y
    ? true
    : false;
}
