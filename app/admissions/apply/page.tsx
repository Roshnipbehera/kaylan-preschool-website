import { Suspense } from "react";
import type { Metadata } from "next";
import { AdmissionApplyForm } from "@/components/admissions/AdmissionApplyForm";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Apply for Admission | Kaylan Preschool",
  description: "Start your child's journey with Kaylan Preschool -- complete our simple 5-step admission application.",
};

export default function AdmissionApplyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3 text-[#3a2e4d]">
            Admission Application 🎒
          </h1>
          <p className="text-center text-[#5b4b6b] mb-10">
            Five quick steps to start your child&apos;s journey with Kaylan Preschool.
          </p>
          <Suspense fallback={<div className="text-center py-12 text-[#5b4b6b]">Loading application form...</div>}>
            <AdmissionApplyForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
