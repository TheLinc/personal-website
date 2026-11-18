/** Which card a horizontally scrolled row is showing, given the distance between card starts. */
export const activeIndex = (scrollLeft: number, step: number, count: number) =>
  step ? Math.min(count - 1, Math.max(0, Math.round(scrollLeft / step))) : 0;
