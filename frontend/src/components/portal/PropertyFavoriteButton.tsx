"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  propertyId: string;
  className?: string;
}

export function PropertyFavoriteButton({ propertyId, className }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(Boolean(token));
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/portal/favorites")
      .then((res) => {
        const ids = (res.data.data ?? []).map((p: { id: string }) => p.id);
        setSaved(ids.includes(propertyId));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  async function toggle() {
    if (!loggedIn) return;
    setBusy(true);
    try {
      if (saved) {
        await api.delete(`/portal/favorites/${propertyId}`);
        setSaved(false);
      } else {
        await api.post(`/portal/favorites/${propertyId}`);
        setSaved(true);
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Button variant="outline" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!loggedIn) {
    return (
      <Button variant="outline" asChild className={className}>
        <Link href="/portal/login">Sign in to save</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      onClick={toggle}
      disabled={busy}
      className={cn(className)}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Heart className={cn("h-4 w-4 mr-2", saved && "fill-current")} />
          {saved ? "Saved" : "Save Property"}
        </>
      )}
    </Button>
  );
}
