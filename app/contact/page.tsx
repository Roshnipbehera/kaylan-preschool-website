import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactClientForm } from "@/components/contact/ContactClientForm";

export const metadata: Metadata = {
  title: "Contact Us & Campus Location",
  description:
    "Contact Kaylan Preschool in Electronic City, Bangalore. Phone: +91 96636 30221, Email: kpsdc01@gmail.com. Get Google Maps driving directions and visit our campus.",
};

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.04358897217!2d77.6398347108992!3d12.847648587399878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b9b672e8d85%3A0xd95610aa3ce6c9e2!2sKaylan%20Preschool!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=12.8476486,77.6424096";

const INSTAGRAM_URL =
  "https://www.instagram.com/kaylanpreschoolanddaycare?stkn=MXR5ZXJmc2c4Z202dw==";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-white">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF6E0]/70 via-[#FFF9EE]/40 to-white pt-14 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading font-semibold text-candy border border-candy/20 shadow-sm mb-6">
              <MapPin size={14} className="text-candy" />
              Bettadasanapura, Vittasandra, Electronic City
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#3a2e4d]">
              Visit & Connect With <span className="text-candy">Kaylan</span> 📍
            </h1>
            <p className="mt-5 text-lg sm:text-xl font-body text-[#5b4b6b] max-w-3xl mx-auto leading-relaxed">
              We would love to welcome you and your child to our campus. Reach out to schedule a private tour,
              ask about admissions, or explore fee structures.
            </p>
          </div>
        </section>

        {/* Form and Contact Details */}
        <section className="py-12 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Contact Information & Action Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFFDF5] p-6 rounded-3xl border border-sunshine/30 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-candy/15 text-candy flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#3a2e4d]">Our Campus Address</h4>
                    <p className="text-xs text-[#5b4b6b] mt-1 leading-relaxed">
                      30, Near Neo Hospital, Prakruthi Residential Layout, Bettadasanapura, Vittasandra, Bengaluru, Karnataka 560100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-leaf/15 text-leaf flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#3a2e4d]">Direct Phone & WhatsApp</h4>
                    <p className="text-xs text-[#5b4b6b] mt-1">
                      <a href="tel:+919663630221" className="hover:text-candy font-semibold">
                        +91 96636 30221
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky/20 text-sky flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#3a2e4d]">Admissions Desk Email</h4>
                    <p className="text-xs text-[#5b4b6b] mt-1 space-y-0.5">
                      <a href="mailto:kpsdc01@gmail.com" className="hover:text-candy font-semibold block">
                        kpsdc01@gmail.com
                      </a>
                      <a href="mailto:admissions@kaylanpreschool.com" className="text-[#8a7a9a] hover:text-candy block text-[11px]">
                        admissions@kaylanpreschool.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-black/5">
                  <div className="w-10 h-10 rounded-2xl bg-lavender/25 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#3a2e4d]">Campus Visiting Hours</h4>
                    <p className="text-xs text-[#5b4b6b] mt-1 leading-relaxed">
                      Monday – Friday: <strong>8:30 AM – 3:30 PM</strong> (Daycare till 6:30 PM)
                      <br />
                      Saturday: <strong>9:00 AM – 1:00 PM</strong> (Walkthroughs by appointment)
                      <br />
                      Sunday & Public Holidays: <em>Closed</em>
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="bg-[#E8F8EE] border border-leaf/30 p-6 rounded-3xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1B4D3E]">Prefer Instant Chat?</h4>
                  <p className="text-xs text-[#2D6A4F] mt-0.5">Chat directly with our team on WhatsApp.</p>
                </div>
                <a
                  href="https://wa.me/919663630221?text=Hello%20Kaylan%20Preschool!%20I%20would%20like%20to%20enquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-leaf text-white font-heading font-bold px-4 py-2.5 rounded-full text-xs shadow-md hover:bg-leaf/90 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle size={15} />
                  Chat Now
                </a>
              </div>

              {/* Instagram Handle Action */}
              <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 p-6 rounded-3xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#3a2e4d]">Follow on Instagram</h4>
                  <p className="text-xs text-[#d62976] font-semibold mt-0.5">@kaylanpreschoolanddaycare</p>
                </div>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#d62976] to-[#fa7e1e] text-white font-heading font-bold px-4 py-2.5 rounded-full text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Instagram size={15} />
                  Follow
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <ContactClientForm />
            </div>
          </div>
        </section>

        {/* Map & Driving Directions Section */}
        <section className="py-16 bg-[#FAF9FF] border-t border-black/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3a2e4d]">
                  Find Us on Google Maps
                </h3>
                <p className="text-xs text-[#5b4b6b] mt-1">
                  Located at 30, Near Neo Hospital, Prakruthi Residential Layout, Bettadasanapura, Vittasandra, Bengaluru 560100 (Google Plus Code: RJXR+3X).
                </p>
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-candy text-white font-heading font-bold px-6 py-3 rounded-full text-xs shadow-md hover:bg-candy/90 hover:scale-105 transition-all self-start sm:self-auto"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>
            </div>

            <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-gray-100">
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kaylan Preschool Location Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
