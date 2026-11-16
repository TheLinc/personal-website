import { quotes } from "@/content/site";

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <p className="fig">Fig. 7 — From people I&apos;ve worked with</p>
      <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
        {quotes.map((q) => (
          <figure key={q.name} className="border-t border-rule pt-6">
            <span aria-hidden="true" className="display block text-[56px] leading-none text-accent">
              &ldquo;
            </span>
            <blockquote className="mt-2 text-[17px] leading-relaxed text-ink">{q.text}</blockquote>
            <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em]">
              <span className="text-ink">{q.name}</span>
              <span className="mt-1 block text-muted">{q.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
