import { contact } from "@/content/site";

export default function Contact() {
  const [email, ...rest] = contact;
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <p className="fig">Fig. 8 — Contact</p>
      <h2 className="display mt-3 text-[clamp(40px,6vw,80px)] text-muted">Let&apos;s talk</h2>
      <a
        href={email.href}
        className="display mt-10 block break-all text-[clamp(28px,6.4vw,88px)] text-ink transition-colors hover:text-accent"
      >
        {email.label}
      </a>
      <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[13px] uppercase tracking-[0.08em]">
        {rest.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="link-u">
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
