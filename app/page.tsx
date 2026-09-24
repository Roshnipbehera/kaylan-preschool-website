import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Programs from "@/components/Programs";
import Adventures from "@/components/Adventures";
import Teachers from "@/components/Teachers";
import DayTimeline from "@/components/DayTimeline";
import Philosophy from "@/components/Philosophy";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Admissions from "@/components/Admissions";
import WeeklyMenu from "@/components/WeeklyMenu";
import AgeFeeCalculator from "@/components/AgeFeeCalculator";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content">
      <Navbar />
      <Hero />
      <Welcome />
      <Programs />
      <Adventures />
      <Teachers />
      <DayTimeline />
      <WeeklyMenu />
      <Philosophy />
      <Gallery />
      <Testimonials />
      <AgeFeeCalculator />
      <Admissions />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}

