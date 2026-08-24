import type { LocaleCode } from "@/lib/constants";

type L = Record<LocaleCode, string>;

export const ui: Record<string, L> = {
  // Header top bar
  customerPortal: { en: "Customer Portal", fr: "Portail client", rw: "Urubuga rw'abakiriya" },
  adminPortal: { en: "Admin", fr: "Administration", rw: "Ubuyobozi" },
  searchProperty: { en: "Search Property", fr: "Rechercher un bien", rw: "Shaka inyubako" },
  searchSite: { en: "Search Site", fr: "Rechercher", rw: "Shakisha urubuga" },

  // Footer — newsletter
  footerNewsletterTitle: {
    en: "Stay Updated with",
    fr: "Restez informé avec",
    rw: "Menya amakuru mashya na",
  },
  footerNewsletterSubtitle: {
    en: "Subscribe for the latest projects, property listings, and industry insights.",
    fr: "Abonnez-vous pour nos projets, annonces immobilières et actualités du secteur.",
    rw: "Iyandikishe wakire amakuru ku mishinga, inyubako n'amakuru y'ubucuruzi.",
  },
  footerSubscribe: { en: "Subscribe", fr: "S'abonner", rw: "Iyandikishe" },
  footerEmailPlaceholder: {
    en: "Enter your email",
    fr: "Votre adresse e-mail",
    rw: "Andika imeyili yawe",
  },

  // Footer — sections
  footerCompany: { en: "Company", fr: "Entreprise", rw: "Ikigo" },
  footerServices: { en: "Services", fr: "Services", rw: "Serivisi" },
  footerResources: { en: "Resources", fr: "Ressources", rw: "Ibikoresho" },
  footerPortals: { en: "Portals", fr: "Portails", rw: "Imbuga" },
  footerContact: { en: "Contact", fr: "Contact", rw: "Twandikire" },
  footerLanguage: { en: "Language", fr: "Langue", rw: "Ururimi" },
  footerRights: {
    en: "All rights reserved.",
    fr: "Tous droits réservés.",
    rw: "Uburenganzira bwose burabitswe.",
  },
  footerPrivacy: { en: "Privacy Policy", fr: "Politique de confidentialité", rw: "Politike y'ibanga" },
  footerTerms: { en: "Terms of Use", fr: "Conditions d'utilisation", rw: "Amategeko yo gukoresha" },

  // Footer links — company
  aboutUs: { en: "About Us", fr: "À propos", rw: "Turi bande" },
  ourTeam: { en: "Our Team", fr: "Notre équipe", rw: "Itsinda ryacu" },
  careers: { en: "Careers", fr: "Carrières", rw: "Akazi" },
  partners: { en: "Partners", fr: "Partenaires", rw: "Abafatanyabikorwa" },

  // Footer links — services
  architecture: { en: "Architecture & Drawings", fr: "Architecture & plans", rw: "Ubushushanyo & amashusho" },
  construction: { en: "Construction", fr: "Construction", rw: "Kubaka" },
  realEstate: { en: "Real Estate", fr: "Immobilier", rw: "Imidugudu" },
  buildingMaterials: { en: "Building Materials", fr: "Matériaux de construction", rw: "Ibikoresho byo kubaka" },
  interiorDesign: { en: "Interior Design", fr: "Design intérieur", rw: "Gushushanya imbere" },

  // Footer links — resources
  blog: { en: "Blog", fr: "Blog", rw: "Blog" },
  gallery: { en: "Gallery", fr: "Galerie", rw: "Amashusho" },
  faq: { en: "FAQ", fr: "FAQ", rw: "Ibibazo bikunze kubazwa" },

  // Footer links — portals
  customerPortalLink: { en: "Customer Portal", fr: "Portail client", rw: "Urubuga rw'abakiriya" },
  adminErp: { en: "Admin Portal", fr: "Portail admin", rw: "Urubuga rw'ubuyobozi" },

  // Site description (footer blurb)
  siteDescription: {
    en: "Premier construction, real estate, and building materials supplier in Rwanda.",
    fr: "Leader en construction, immobilier et matériaux de construction au Rwanda.",
    rw: "Utanga serivisi z'ubwubatsi, imidugudu n'ibikoresho byo kubaka mu Rwanda.",
  },
  architectureNote: {
    en: "We help with house drawings, quotations, and architecture — from concept to construction-ready plans.",
    fr: "Nous réalisons plans, devis et architecture — du concept au plan prêt à construire.",
    rw: "Dufasha mu gushushanya, gutanga ibiciro n'ubushushanyo — kuva ku gitekerezo kugeza ku mashusho yo kubaka.",
  },
};

export function translate(key: string, locale: LocaleCode): string {
  return ui[key]?.[locale] ?? ui[key]?.en ?? key;
}

export const FOOTER_NAV = {
  company: [
    { key: "aboutUs", href: "/about" },
    { key: "ourTeam", href: "/about#team" },
    { key: "careers", href: "/careers" },
    { key: "partners", href: "/about#partners" },
  ],
  services: [
    { key: "architecture", href: "/services/architecture" },
    { key: "construction", href: "/services/construction" },
    { key: "realEstate", href: "/services/real-estate" },
    { key: "buildingMaterials", href: "/materials" },
    { key: "interiorDesign", href: "/services/interior-design" },
  ],
  resources: [
    { key: "blog", href: "/blog" },
    { key: "gallery", href: "/gallery" },
    { key: "faq", href: "/faq" },
    { key: "footerPrivacy", href: "/privacy" },
  ],
  portals: [
    { key: "customerPortalLink", href: "/portal/login" },
    { key: "adminErp", href: "/admin/login" },
  ],
} as const;
