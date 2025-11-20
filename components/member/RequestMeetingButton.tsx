"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

type RequestMeetingButtonProps = {
  castId: string;
  castName: string;
  locale: string;
};

export default function RequestMeetingButton({
  castId,
  castName,
  locale,
}: RequestMeetingButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/meetings/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ castId }),
      });

      if (response.ok) {
        // Redirect to meetings page or show success message
        router.push(`/${locale}/meetings`);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send meeting request");
      }
    } catch (error) {
      console.error("Error requesting meeting:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRequest}
      disabled={loading}
      className="w-full bg-coral hover:bg-coral/90 text-white font-semibold py-6 rounded-full shadow-airbnb-md hover:shadow-airbnb-lg transition-all"
      style={{ backgroundColor: "var(--color-primary-coral)" }}
    >
      <Calendar className="mr-2 h-5 w-5" />
      {loading ? t("common.loading") : t("meeting.request")}
    </Button>
  );
}
