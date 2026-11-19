/** First and last card (0-based) fully on screen in a horizontally scrolled row, given the distance between card
 *  starts and how far the row can scroll. A card peeking in from the edge doesn't count; at the very end of the
 *  row the last cards are the ones showing. */
export function visibleCards(scrollLeft: number, step: number, count: number, maxScroll: number): [number, number] {
  if (!step) return [0, 0];
  const shown = Math.max(1, count - Math.ceil(maxScroll / step - 0.05));
  const atEnd = scrollLeft >= maxScroll - 1;
  const first = atEnd ? count - shown : Math.min(count - shown, Math.max(0, Math.round(scrollLeft / step)));
  return [first, first + shown - 1];
}
