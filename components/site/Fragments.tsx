// Pieces of the hero's line pattern behind each section: ledges, vertical runs, crosses and quarter arcs.
// Positions are % of the viewport width (x) and of the section height (y); CSS draws them in on scroll.
type Frag =
  | ["h", number, number, number] // horizontal: x, y, length (% width)
  | ["v", number, number, number] // vertical: x, y, length (% height)
  | ["x", number, number] // cross
  | ["arc", number, number, number, number]; // quarter arc: x, y, size (px), rotation (deg)

const SETS: Record<string, Frag[]> = {
  agents: [["x", 7, 4], ["v", 93, 0, 45], ["h", 88, 45, 12], ["x", 93, 45]],
  experience: [["arc", 1.5, 8, 240, 0], ["v", 7, 25, 50], ["x", 7, 75], ["x", 79.2, 3], ["h", 86, 60, 14]],
  work: [["x", 7, 2], ["h", 0, 8, 13], ["v", 93, 12, 28], ["x", 93, 40], ["v", 7, 52, 30], ["arc", 84, 68, 280, 90]],
  github: [["h", 0, 30, 12], ["x", 12, 30], ["x", 88, 75], ["h", 88, 75, 12]],
  skills: [["x", 79.2, 6], ["v", 93, 10, 40]],
  reviews: [["arc", 88, 4, 220, 90], ["v", 7, 0, 55], ["x", 7, 55]],
  hire: [["h", 0, 12, 20.8], ["x", 20.8, 12], ["x", 79.2, 12], ["h", 79.2, 12, 20.8]],
};

export default function Fragments({ of }: { of: keyof typeof SETS }) {
  return (
    <div className="frags" aria-hidden="true">
      {SETS[of].map((f, i) => {
        const at = { left: `${f[1]}%`, top: `${f[2]}%` };
        if (f[0] === "h") return <i key={i} className="fh" style={{ ...at, width: `${f[3]}%` }} />;
        if (f[0] === "v") return <i key={i} className="fv" style={{ ...at, height: `${f[3]}%` }} />;
        if (f[0] === "x") return <i key={i} className="fx" style={at} />;
        return (
          <svg key={i} className="fa" viewBox="0 0 100 100" style={{ ...at, width: f[3], height: f[3], rotate: `${f[4]}deg` }}>
            <path d="M0 100A100 100 0 0 1 100 0" pathLength={1} />
          </svg>
        );
      })}
    </div>
  );
}
