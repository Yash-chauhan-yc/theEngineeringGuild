import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Catalogue from "@/components/Catalogue";
import Gallery from "@/components/Gallery";
import Process from "@/components/Process";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ClientShell from "@/components/ClientShell";

export default function Home() {
  return (
    <ClientShell>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Catalogue />
        <Gallery />
        <Process />
        <About />
        <Brands />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </ClientShell>
  );
}
