import Nav from "@/components/Nav/Nav";
import { getCalendar } from "@/lib/github";

export const revalidate = 86400;

export default async function Home() {
  const calendar = await getCalendar();
  return (
    <>
      <Nav />
      <main>
        <section id="hero" data-total={calendar.total} />
        <section id="work" />
        <section id="experience" />
        <section id="agents" />
        <section id="testimonials" />
        <section id="contact" />
      </main>
    </>
  );
}
