import { cookies } from "next/headers";
import type { LocaleCode } from "@/lib/constants";

const LOCALE_COOKIE = "green-rock-locale";

export async function getServerLocale(): Promise<LocaleCode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value === "fr" || value === "rw" || value === "en") return value;
  return "en";
}
