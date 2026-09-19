"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePublicSettings } from "@/lib/hooks/usePublicSettings";
import { createContactInquirySchema, type CreateContactInquiryFormValues } from "@/lib/validation/contact";
import { createContactInquiry } from "@/lib/api/contact";
import { useToast } from "@/lib/hooks/useToast";

export default function Contact() {
  const { data } = usePublicSettings();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactInquiryFormValues>({
    resolver: zodResolver(createContactInquirySchema),
    defaultValues: { parentName: "", phone: "", message: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: CreateContactInquiryFormValues) => {
    setSubmitting(true);
    try {
      await createContactInquiry(values);
      toast.success("Enquiry sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const telHref = `tel:${data.contactPhone.replace(/[^+\d]/g, "")}`;
  const waHref = `https://wa.me/${data.contactPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Hello Kaylan Preschool! I would like to enquire about admission and book a tour."
  )}`;
  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-white to-[#EAF8FF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3">Find Us 🏘️</h2>
        <p className="text-[#5b4b6b] text-center max-w-xl mx-auto mb-14">
          Nestled in a friendly Electronic City neighbourhood — come say hello!
        </p>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Real Campus Visual & Visiting Hours Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-white group">
              <div className="relative h-64 sm:h-72 w-full">
                <Image
                  src="/images/gallery-outdoor.jpg"
                  alt="Kaylan Preschool Outdoor Play Garden Electronic City Bangalore"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-heading font-semibold mb-1">
                    🌿 10,000 Sq.Ft Green Campus
                  </span>
                  <h3 className="font-display text-xl font-bold">Kaylan Preschool & Daycare</h3>
                  <p className="text-xs text-white/90">Electronic City Phase 1, Bangalore 560100</p>
                </div>
              </div>

              {/* Visiting Hours & Tour Invitation */}
              <div className="p-6 bg-white space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#3a2e4d]">
                  <Clock className="w-5 h-5 text-candy shrink-0" />
                  <div>
                    <p className="font-heading font-bold text-xs uppercase tracking-wider text-[#8a7a9a]">Campus Tour Timings</p>
                    <p className="font-heading font-semibold text-sm">Mon – Fri: 8:30 AM – 3:30 PM · Sat: 9:00 AM – 1:00 PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#3a2e4d]">
                  <MapPin className="w-5 h-5 text-leaf shrink-0" />
                  <div>
                    <p className="font-heading font-bold text-xs uppercase tracking-wider text-[#8a7a9a]">Campus Address</p>
                    <p className="font-body text-xs text-[#5b4b6b] leading-relaxed">{data.address}</p>
                  </div>
                </div>

                {data.googleMapsUrl && (
                  <a
                    href={data.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-[#FFF9EE] hover:bg-[#FFF3D6] text-[#4a3b00] rounded-2xl font-heading font-bold text-xs transition-colors border border-sunshine/40"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Contact Chips */}
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href={telHref}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-black/5"
              >
                <div className="w-10 h-10 rounded-xl bg-candy/10 flex items-center justify-center text-candy shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a7a9a]">Call Us</p>
                  <p className="text-xs font-heading font-bold text-[#3a2e4d]">{data.contactPhone}</p>
                </div>
              </a>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-black/5"
              >
                <div className="w-10 h-10 rounded-xl bg-leaf/10 flex items-center justify-center text-leaf shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a7a9a]">WhatsApp</p>
                  <p className="text-xs font-heading font-bold text-[#3a2e4d]">Quick Chat</p>
                </div>
              </a>

              <a
                href={`mailto:${data.contactEmail}`}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-black/5 sm:col-span-2"
              >
                <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center text-sky shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a7a9a]">Admissions Email</p>
                  <p className="text-xs font-heading font-bold text-[#3a2e4d]">{data.contactEmail}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Parent Enquiry Form */}
          <div className="space-y-6">

            <form className="bg-white rounded-3xl p-6 shadow-lg space-y-3" onSubmit={handleSubmit(onSubmit)} data-testid="contact-enquiry-form">
              <div>
                <input
                  className="w-full rounded-full border-2 border-[#FFE3A8] px-5 py-3 text-sm"
                  placeholder="Parent Name"
                  {...register("parentName")}
                />
                {errors.parentName && (
                  <p className="text-xs font-semibold text-red-500 mt-1 px-2">{errors.parentName.message}</p>
                )}
              </div>
              <div>
                <input
                  className="w-full rounded-full border-2 border-[#FFE3A8] px-5 py-3 text-sm"
                  placeholder="Phone Number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs font-semibold text-red-500 mt-1 px-2">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <textarea
                  className="w-full rounded-2xl border-2 border-[#FFE3A8] px-5 py-3 text-sm"
                  placeholder="Tell us about your little one"
                  rows={3}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs font-semibold text-red-500 mt-1 px-2">{errors.message.message}</p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.03 }}
                whileTap={{ scale: submitting ? 1 : 0.96 }}
                className="w-full bg-candy text-white font-heading font-bold py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Enquiry 💌"}
              </motion.button>
            </form>

            <div className="rounded-2xl p-5 bg-[#FFFDF8] border border-sunshine/40 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-wider text-[#8a7a9a]">Direct Admissions Helpline</p>
                <p className="font-heading font-semibold text-sm text-[#3a2e4d]">Have immediate queries? Talk to our principal.</p>
              </div>
              <a
                href={telHref}
                className="shrink-0 bg-candy text-white font-heading font-bold text-xs px-4 py-2.5 rounded-full shadow hover:scale-105 transition-transform"
              >
                Call Now 📞
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Google Maps Embed Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white bg-white relative"
        >
          <div className="p-6 bg-gradient-to-r from-[#FFFDF8] to-[#FFF9EE] border-b border-sunshine/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-leaf/10 flex items-center justify-center text-xl shrink-0">
                🗺️
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#3a2e4d]">Explore Our Campus Location</h3>
                <p className="text-xs text-[#5b4b6b]">Plot #14, NeoTown Rd, Electronic City Phase 1, Bangalore 560100</p>
              </div>
            </div>
            <a
              href={data.googleMapsUrl || "https://www.google.com/maps/place/Kaylan+Preschool/@12.8476538,77.6398347,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b9b672e8d85:0xd95610aa3ce6c9e2!8m2!3d12.8476486!4d77.6424096"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-candy text-white font-heading font-bold text-xs px-5 py-2.5 rounded-full shadow hover:scale-105 transition-transform shrink-0"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="relative w-full h-[360px] sm:h-[420px] bg-[#f0f0f0]">
            <iframe
              title="Kaylan Preschool Official Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.854652579144!2d77.6398347!3d12.8476538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b9b672e8d85%3A0xd95610aa3ce6c9e2!2sKaylan%20Preschool!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
