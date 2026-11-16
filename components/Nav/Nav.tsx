import Link from "next/link";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "/agents", href: "/agents" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 font-mono text-[11px] uppercase tracking-[0.08em] md:px-10">
        <Link href="/" className="text-ink">
          LL<span className="text-accent">/</span>
          <span className="hidden sm:inline">Lincoln Laylor</span>
        </Link>
        <ul className="flex gap-4 text-muted sm:gap-7">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
