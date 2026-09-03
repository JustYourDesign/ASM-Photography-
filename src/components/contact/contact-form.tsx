"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingField } from "@/components/contact/floating-field";
import { Magnetic } from "@/components/animations/magnetic";
import { contactSchema, enquiryTypes, type ContactFormValues } from "@/lib/validation";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { enquiryType: "Wedding" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("submitting");
    try {
      // TODO: wire up EmailJS once you have your Service ID, Template ID, and Public Key.
      // import emailjs from "@emailjs/browser";
      // await emailjs.send(
      //   process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      //   process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      //   values,
      //   process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      // );
      if (process.env.NODE_ENV !== "production") {
        console.info("Enquiry submission (EmailJS not yet configured):", values);
      }
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="border-t border-beige py-16"
      >
        <p className="label text-beige">Enquiry received</p>
        <h3 className="mt-6 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.05] text-foreground">
          Thank you — I&rsquo;ll be in touch.
        </h3>
        <p className="mt-5 max-w-sm text-sm leading-[1.85] text-foreground/60">
          Wedding enquiries are answered within one to two business days, usually with a
          few questions about your day and the next available dates.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-9" noValidate>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <FloatingField label="Name" registration={register("name")} error={errors.name?.message} />
        <FloatingField
          label="Email"
          type="email"
          registration={register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <FloatingField
          label="Phone"
          type="tel"
          registration={register("phone")}
          error={errors.phone?.message}
        />
        <FloatingField
          label="Enquiring about"
          options={enquiryTypes}
          registration={register("enquiryType")}
          error={errors.enquiryType?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <FloatingField
          label="Wedding date (if known)"
          type="date"
          registration={register("date")}
          error={errors.date?.message}
        />
        <FloatingField
          label="Venue or location"
          registration={register("location")}
          error={errors.location?.message}
        />
      </div>

      <FloatingField
        label="Tell me about your day"
        textarea
        registration={register("message")}
        error={errors.message?.message}
      />

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="text-sm text-red-500"
          >
            Something went wrong. Please try again, or email hello@asmphotography.co.za.
          </motion.p>
        )}
      </AnimatePresence>

      <Magnetic className="inline-block self-start">
        <button
          type="submit"
          disabled={status === "submitting"}
          data-cursor="hidden"
          className="inline-flex items-center gap-3 border border-foreground bg-foreground px-9 py-4 label text-background transition-opacity duration-500 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      </Magnetic>
    </form>
  );
}
