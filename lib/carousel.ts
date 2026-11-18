/** Which card a horizontally scrolled row is showing, given the distance between card starts. Once the row
 *  can't scroll any further (several cards fit on screen), it counts as the last card. */
export function activeIndex(scrollLeft: number, step: number, count: number, maxScroll = Infinity): number {
  if (scrollLeft >= maxScroll - 1) return count - 1;
  return step ? Math.min(count - 1, Math.max(0, Math.round(scrollLeft / step))) : 0;
}
