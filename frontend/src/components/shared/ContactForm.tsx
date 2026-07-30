"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle, CalendarDays, Package, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const contactSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    type: z.enum([
      "QUOTE",
      "PROPERTY",
      "MATERIAL",
      "CONSTRUCTION",
      "GENERAL",
      "APPOINTMENT",
    ]),
    message: z.string().min(10, "Message must be at least 10 characters"),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    service: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "APPOINTMENT") {
      if (!data.phone || data.phone.length < 6) {
        ctx.addIssue({ code: "custom", message: "Phone is required for booking", path: ["phone"] });
      }
      if (!data.preferredDate) {
        ctx.addIssue({ code: "custom", message: "Please choose a date", path: ["preferredDate"] });
      }
      if (!data.preferredTime) {
        ctx.addIssue({ code: "custom", message: "Please choose a time", path: ["preferredTime"] });
      }
    }
  });

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
  defaultType?: ContactFormData["type"];
}

const TYPE_HINTS: Record<ContactFormData["type"], string> = {
  QUOTE: "Tell us about your project for a detailed quotation.",
  PROPERTY: "Share the property you are interested in or your requirements.",
  MATERIAL: "List materials, quantities, and delivery location.",
  CONSTRUCTION: "Describe your construction project scope and timeline.",
  APPOINTMENT: "Pick a date and time — we will confirm your visit.",
  GENERAL: "How can we help you today?",
};

export function ContactForm({ className, defaultType = "GENERAL" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("Message Sent!");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: defaultType },
  });

  const inquiryType = useWatch({ control, name: "type" });
  const isBooking = inquiryType === "APPOINTMENT";
  const isOrder = inquiryType === "MATERIAL";

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      if (data.type === "APPOINTMENT") {
        const dateIso = new Date(`${data.preferredDate}T12:00:00`).toISOString();
        await api.post("/appointments", {
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: dateIso,
          time: data.preferredTime,
          service: data.service || "General consultation",
          message: data.message,
        });
        setSuccessTitle("Booking Request Sent!");
      } else {
        await api.post("/inquiries", {
          name: data.name,
          email: data.email,
          phone: data.phone,
          type: data.type,
          message: data.message,
        });
        setSuccessTitle(isOrder ? "Order Request Sent!" : "Message Sent!");
      }
      setStatus("success");
      reset({ type: defaultType });
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  if (status === "success") {
    return (
      <div className={cn("pro-card p-8 text-center", className)}>
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{successTitle}</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours at your email address.
        </p>
        <Button onClick={() => setStatus("idle")} variant="outline">
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("pro-card p-6 lg:p-8 space-y-5", className)}
    >
      <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 flex gap-3 items-start">
        {isBooking ? (
          <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        ) : isOrder ? (
          <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        ) : (
          <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {TYPE_HINTS[inquiryType || defaultType]}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
          <Input placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Phone {isBooking ? "*" : ""}
          </label>
          <Input placeholder="+250 785 652 011" {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Request Type *</label>
          <Select
            defaultValue={defaultType}
            onValueChange={(val) => setValue("type", val as ContactFormData["type"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QUOTE">Request a Quote</SelectItem>
              <SelectItem value="PROPERTY">Property Inquiry</SelectItem>
              <SelectItem value="MATERIAL">Materials Order</SelectItem>
              <SelectItem value="CONSTRUCTION">Construction Project</SelectItem>
              <SelectItem value="APPOINTMENT">Book Appointment</SelectItem>
              <SelectItem value="GENERAL">General Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isBooking && (
        <div className="grid sm:grid-cols-3 gap-5 p-4 rounded-xl border border-secondary/30 bg-secondary/5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Preferred Date *</label>
            <Input type="date" min={new Date().toISOString().split("T")[0]} {...register("preferredDate")} />
            {errors.preferredDate && <p className="text-xs text-red-500 mt-1">{errors.preferredDate.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Preferred Time *</label>
            <Select onValueChange={(v) => setValue("preferredTime", v)}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredTime && <p className="text-xs text-red-500 mt-1">{errors.preferredTime.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Service</label>
            <Select onValueChange={(v) => setValue("service", v)}>
              <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Architecture & Drawings">Architecture & Drawings</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Building Materials">Building Materials</SelectItem>
                <SelectItem value="Interior Design">Interior Design</SelectItem>
                <SelectItem value="General Consultation">General Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1.5 block">
          {isBooking ? "Additional Notes *" : isOrder ? "Order Details *" : "Message *"}
        </label>
        <Textarea
          placeholder={
            isOrder
              ? "Product names, quantities, delivery address..."
              : isBooking
                ? "Tell us what you'd like to discuss during the visit..."
                : "Tell us about your project or inquiry..."
          }
          rows={5}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      {status === "error" && <p className="text-sm text-red-500">{errorMessage}</p>}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {isBooking ? "Book Appointment" : isOrder ? "Submit Order Request" : "Send Message"}
          </>
        )}
      </Button>
    </form>
  );
}
