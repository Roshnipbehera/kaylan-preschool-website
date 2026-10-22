import type { Metadata } from "next";
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
import AgeFeeCalculator from "@/components/AgeFeeCalculator";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kaylan Preschool | Where Little Dreams Begin — Electronic City, Bangalore",
  description:
    "Kaylan Preschool in Electronic City, Bangalore blends Montessori-inspired learning with the Kreedo curriculum in a magical, storybook world of play, discovery, creativity and love. Admissions open 2026-27.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kaylan Preschool | Where Little Dreams Begin — Electronic City, Bangalore",
    description:
      "A magical storybook world of play-based early learning, Montessori sensorial exploration, and caring educators in Bangalore.",
    url: "/",
  },
};

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

