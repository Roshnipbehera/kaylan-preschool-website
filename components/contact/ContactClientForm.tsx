"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/useToast";

const contactFormSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid 10-digit mobile number"),
  childAge: z.string().min(1, "Please select your child's age"),
  program: z.string().min(1, "Please select a program"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactClientForm() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      parentName: "",
      email: "",
      phone: "",
      childAge: "",
      program: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    // Simulate brief network submission
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setSubmitted(true);
    toast.success("Thank you! Our Admissions Counsellor will call you within 24 hours.");
    reset();
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-leaf/30 text-center">
        <div className="w-14 h-14 rounded-full bg-leaf/15 text-leaf flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-heading text-2xl font-bold text-[#3a2e4d]">Message Received!</h3>
        <p className="text-sm text-[#5b4b6b] mt-2 mb-6 max-w-md mx-auto">
          Thank you for reaching out to Kaylan Preschool. Our admissions coordinator has received your enquiry
          and will contact you via WhatsApp or phone to confirm your school walkthrough.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-heading font-bold text-candy underline hover:text-candy/80"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 shadow-md border border-black/5">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-candy bg-candy/10 px-3 py-1 rounded-full mb-2">
          <Sparkles size={13} className="text-sunshine fill-sunshine" />
          Quick Response Guaranteed
        </span>
        <h3 className="font-heading text-2xl font-bold text-[#3a2e4d]">Send Us an Enquiry</h3>
        <p className="text-xs text-[#5b4b6b] mt-1">Book a tour, request fee details, or ask any question.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Parent's Full Name"
            placeholder="e.g. Priya Sharma"
            error={errors.parentName?.message}
            {...register("parentName")}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="priya@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div>
            <Input
              label="Mobile Number (WhatsApp)"
              placeholder="+91 96636 30221"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">
              Child&apos;s Current Age
            </label>
            <select
              {...register("childAge")}
              className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-xs text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
            >
              <option value="">Select Age</option>
              <option value="1.5 - 2.5 yrs">1.5 – 2.5 Years</option>
              <option value="2.5 - 3.5 yrs">2.5 – 3.5 Years</option>
              <option value="3.5 - 4.5 yrs">3.5 – 4.5 Years</option>
              <option value="4.5 - 5.5 yrs">4.5 – 5.5 Years</option>
              <option value="5.5+ yrs">5.5+ Years</option>
            </select>
            {errors.childAge && <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.childAge.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">
              Program of Interest
            </label>
            <select
              {...register("program")}
              className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-xs text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
            >
              <option value="">Select Program</option>
              <option value="Playgroup L0">Playgroup L0 (2 – 3 yrs)</option>
              <option value="Nursery L1">Nursery L1 (3 – 4 yrs)</option>
              <option value="Junior KG L3">Junior KG L3 (4 – 5 yrs)</option>
              <option value="Senior KG L4">Senior KG L4 (5 – 6 yrs)</option>
              <option value="Daycare">Daycare (Ages 1 – 10 yrs · till 6:30 PM)</option>
              <option value="After-School Program">After-School Program (Ages 4 – 10 yrs)</option>
              <option value="Campus Tour">General Campus Tour</option>
            </select>
            {errors.program && <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.program.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">
            Additional Message or Preferred Tour Date (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Tell us about your child or when you would like to visit..."
            className="w-full rounded-2xl border-2 border-lavender/40 bg-white p-3.5 font-body text-xs text-[#3a2e4d] placeholder:text-[#3a2e4d]/40 focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
            {...register("message")}
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          <Send size={16} className="mr-2" />
          Submit Enquiry
        </Button>
      </div>
    </form>
  );
}
