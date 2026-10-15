import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import About from "@/components/About";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <main>
        <Hero3D />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
