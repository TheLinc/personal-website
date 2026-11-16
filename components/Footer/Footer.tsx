const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
const built = new Date().toISOString().slice(0, 10);

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="fig mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-8 md:px-10">
        <span>© 2026 Lincoln Laylor</span>
        <span>
          Build {sha} · {built} · Next.js, three.js
        </span>
      </div>
    </footer>
  );
}
