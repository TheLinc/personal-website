// Background lines behind the bust: a horizon, a few vertical guides, two diagonals running out
// from the shoulders and small crosses where lines meet. They draw themselves in once, quietly.
const LINES = [
  "M0 560H1440", // horizon at shoulder height
  "M300 0V900", "M1140 0V900", // guides framing the text columns
  "M720 560L180 900", "M720 560L1260 900", // floor lines out from under the bust
  "M0 300H240", "M1200 300H1440", // short ledges at text height
  "M420 560A300 300 0 0 1 1020 560", // arc behind the head
];
const CROSSES: [number, number][] = [[300, 560], [1140, 560], [300, 300], [1140, 300], [720, 260]];

export default function HeroLines() {
  return (
    <svg className="hero-lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {LINES.map((d, i) => (
        <path key={d} d={d} pathLength={1} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      {CROSSES.map(([x, y], i) => (
        <path key={`${x}-${y}`} className="x" d={`M${x - 7} ${y}h14M${x} ${y - 7}v14`} style={{ animationDelay: `${0.9 + i * 0.1}s` }} />
      ))}
    </svg>
  );
}
