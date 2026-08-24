export const SITE_CONFIG = {
  name: "Green Rock General Supply Ltd",
  shortName: "Green Rock",
  tagline: "Building Excellence, Supplying Quality",
  description:
    "Premier construction, real estate, and building materials supplier in Rwanda. We help with house drawings, architectural plans, and detailed quotations for your building project.",
  architectureNote:
    "We help in drawing, making quotations, and architecture of the house to be built — from concept to construction-ready plans.",
  email: "ishimwehervin10@gmail.com",
  phone: "+250 785 652 011",
  whatsapp: "+250785652011",
  address: "Kigali, Rwanda",
  coordinates: { lat: -1.9403, lng: 29.8739 },
  founded: 2010,
  logo: "/logo.svg",
} as const;

export type { NavItem } from "@/lib/nav-data";
export { NAV_LINKS } from "@/lib/nav-data";

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
    { label: "Partners", href: "/about#partners" },
  ],
  services: [
    { label: "Architecture & Drawings", href: "/services/architecture" },
    { label: "Construction", href: "/services/construction" },
    { label: "Real Estate", href: "/services/real-estate" },
    { label: "Building Materials", href: "/materials" },
    { label: "Interior Design", href: "/services/interior-design" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  portals: [
    { label: "Customer Portal", href: "/portal/login" },
    { label: "Employee Portal", href: "/employee/login" },
    { label: "Admin ERP", href: "/admin/login" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/greenrock", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/greenrock", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/greenrock", icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com/greenrock", icon: "twitter" },
  { label: "YouTube", href: "https://youtube.com/@greenrock", icon: "youtube" },
] as const;

export const COMPANY_STATS = [
  { label: "Projects Completed", value: 250, suffix: "+" },
  { label: "Happy Clients", value: 500, suffix: "+" },
  { label: "Properties Listed", value: 120, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
] as const;

export const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];
