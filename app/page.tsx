import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import { getCalendar } from "@/lib/github";

export const revalidate = 86400;

export default async function Home() {
  const calendar = await getCalendar();
  return (
    <>
      <Nav />
      <main>
        <Hero calendar={calendar} />
        <section id="work" />
        <section id="experience" />
        <section id="agents" />
        <section id="testimonials" />
        <section id="contact" />
      </main>
    </>
  );
}
