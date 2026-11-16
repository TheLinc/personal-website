import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import Work from "@/components/Work/Work";
import Experience from "@/components/Experience/Experience";
import AgentsTeaser from "@/components/AgentsTeaser/AgentsTeaser";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import { getCalendar } from "@/lib/github";

export const revalidate = 86400;

export default async function Home() {
  const calendar = await getCalendar();
  return (
    <>
      <Nav />
      <main>
        <Hero calendar={calendar} />
        <Work />
        <Experience />
        <AgentsTeaser />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
