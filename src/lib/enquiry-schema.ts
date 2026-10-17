import { z } from "zod";

export const SERVICE_IDS = ["retrofit", "repair", "manufacturing", "spares", "other"] as const;
export const URGENCY_IDS = ["standard", "emergency"] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .max(25)
    .regex(/^[+\d\s()-]*$/, "Phone can contain digits, spaces, +, ( ) and -")
    .optional()
    .default(""),
  machine: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(4000),
  service: z.enum(SERVICE_IDS).default("retrofit"),
  urgency: z.enum(URGENCY_IDS).default("standard"),
  figure: z.string().trim().max(40).optional().default(""),
  // Honeypot — real people never fill this hidden field
  website: z.string().max(0).optional().default(""),
}).superRefine((v, ctx) => {
  if (v.urgency === "emergency" && v.phone.replace(/\D/g, "").length < 7) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "A phone number is required for emergency call-backs" });
  }
});

export type Enquiry = z.infer<typeof enquirySchema>;

export const SERVICE_LABEL: Record<(typeof SERVICE_IDS)[number], string> = {
  retrofit: "Retrofit & Upgrades",
  repair: "Lab Repair",
  manufacturing: "Manufacturing",
  spares: "Spares & Supplies",
  other: "Other",
};
