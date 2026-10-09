import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero3D />
        <Services />
        <Portfolio />
        <WhyUs />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
