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
export function checkIsNear(
  bounds: DOMRect,
  coordinates: { x: number; y: number },
  threshold?: number
) {
  const actualThreshold = threshold || THRESHOLD;

  if (!bounds || !coordinates) return false;
  const left = bounds.x - actualThreshold < 0 ? 0 : bounds.x - actualThreshold;
  const right = bounds.x + bounds.width + actualThreshold;
  const top = bounds.y - actualThreshold < 0 ? 0 : bounds.y - actualThreshold;
  const bottom = bounds.y + bounds.height + actualThreshold;
  return left < coordinates.x &&
    right > coordinates.x &&
    top < coordinates.y &&
    bottom > coordinates.y
    ? true
    : false;
}
