"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
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
          {/* Illustrated neighbourhood */}
          <motion.svg
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            viewBox="0 0 400 260"
            className="w-full rounded-3xl bg-white shadow-lg"
          >
            <rect width="400" height="260" fill="#DCF3FF" />
            <rect y="200" width="400" height="60" fill="#B7E7A6" />
            <rect y="215" width="400" height="14" fill="#e8e2c8" />
            <circle cx="60" cy="50" r="20" fill="white" opacity="0.9" />
            <circle cx="90" cy="45" r="26" fill="white" opacity="0.9" />
            <rect x="150" y="130" width="110" height="80" rx="10" fill="#FFD93D" />
            <polygon points="145,130 265,130 205,90" fill="#FF8FB1" />
            <rect x="190" y="165" width="30" height="45" fill="#6EC6FF" rx="4" />
            <rect x="30" y="150" width="12" height="55" fill="#c98b4a" />
            <circle cx="36" cy="140" r="28" fill="#7ED957" />
            <rect x="340" y="150" width="12" height="55" fill="#c98b4a" />
            <circle cx="346" cy="140" r="28" fill="#7ED957" />
            <text x="270" y="215" fontSize="22">🚗</text>
            <text x="90" y="220" fontSize="22">🧒</text>
          </motion.svg>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={telHref} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow">
                <Phone className="text-candy" /> <span className="text-sm font-heading">{data.contactPhone}</span>
              </a>
              <a href={waHref} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow">
                <MessageCircle className="text-leaf" /> <span className="text-sm font-heading">WhatsApp Us</span>
              </a>
              <a href={`mailto:${data.contactEmail}`} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow">
                <Mail className="text-sky" /> <span className="text-sm font-heading">{data.contactEmail}</span>
              </a>
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow">
                <MapPin className="text-orange" /> <span className="text-sm font-heading">{data.address}</span>
              </div>
            </div>

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

            {data.googleMapsUrl ? (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl overflow-hidden shadow h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-300 transition-colors"
              >
                View on Google Maps — {data.address}
              </a>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                {data.address}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
