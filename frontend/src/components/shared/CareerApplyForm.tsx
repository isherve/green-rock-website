"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";

import { getApiBaseUrl } from "@/lib/api-url";

const API_URL = getApiBaseUrl();

interface CareerApplyFormProps {
  careerId: string;
  jobTitle: string;
}

export function CareerApplyForm({ careerId, jobTitle }: CareerApplyFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const resume = formData.get("resume");
    if (!resume || !(resume instanceof File) || resume.size === 0) {
      setErrorMessage("Please attach your resume (PDF or Word)");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      await axios.post(`${API_URL}/careers/${careerId}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to submit application. Please try again.";
      setErrorMessage(message);
    }
  }

  if (status === "success") {
    return (
      <div className="pro-card p-8 rounded-2xl text-center">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for applying for {jobTitle}. We will review your application and get back to you soon.
        </p>
        <Button onClick={() => setStatus("idle")} variant="outline">Submit Another</Button>
      </div>
    );
  }

  return (
    <form className="pro-card p-8 rounded-2xl space-y-4" onSubmit={handleSubmit}>
      <Input name="name" placeholder="Full Name" required disabled={status === "loading"} />
      <Input name="email" type="email" placeholder="Email" required disabled={status === "loading"} />
      <Input name="phone" placeholder="Phone" required disabled={status === "loading"} />
      <Input name="resume" type="file" accept=".pdf,.doc,.docx" className="cursor-pointer" required disabled={status === "loading"} />
      <Textarea name="coverLetter" placeholder="Cover Letter (optional)" rows={4} disabled={status === "loading"} />
      {status === "error" && <p className="text-sm text-red-500">{errorMessage}</p>}
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
      </Button>
    </form>
  );
}
