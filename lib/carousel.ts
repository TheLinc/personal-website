/** First and last card (0-based) on screen in a horizontally scrolled row, given the distance between card
 *  starts and how far the row can scroll. The number on screen is whatever is left once the row hits its end. */
export function visibleCards(scrollLeft: number, step: number, count: number, maxScroll: number): [number, number] {
  if (!step) return [0, 0];
  const start = (x: number) => Math.min(count - 1, Math.max(0, Math.round(x / step)));
  const shown = count - start(maxScroll);
  const first = Math.min(start(scrollLeft), count - shown);
  return [first, first + shown - 1];
}
