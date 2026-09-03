import { z } from "zod";

export const enquiryTypes = [
  "Wedding",
  "Engagement session",
  "Fashion / Editorial",
  "Studio session",
  "Something else",
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  enquiryType: z.enum(enquiryTypes),
  // Wedding-specific, and optional so non-wedding enquiries aren't blocked.
  date: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a little more about your day"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
