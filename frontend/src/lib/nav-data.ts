import type { LucideIcon } from "lucide-react";
import {
  Home,
  Building2,
  Building,
  LandPlot,
  Store,
  Warehouse,
  Key,
  Tag,
  Star,
  MapPin,
  PenTool,
  Hammer,
  Truck,
  Package,
  Layers,
  PaintBucket,
  Pipette,
  Zap,
  ClipboardList,
  HardHat,
  Ruler,
  Briefcase,
  Users,
  Handshake,
  BookOpen,
  Image,
  HelpCircle,
  FileText,
  Phone,
} from "lucide-react";

export type NavLinkItem = {
  labelKey: string;
  href: string;
  descriptionKey?: string;
  icon?: LucideIcon;
  badgeKey?: string;
  /** Resolved at runtime by getLocalizedNav */
  label?: string;
  description?: string;
  badge?: string;
};

export type NavMegaSection = {
  titleKey: string;
  items: NavLinkItem[];
  /** Resolved at runtime */
  title?: string;
};

export type NavFeaturedPanel = {
  titleKey: string;
  descriptionKey: string;
  href: string;
  ctaKey: string;
  image: string;
  /** Resolved at runtime */
  title?: string;
  description?: string;
  cta?: string;
};

export type NavItem = {
  labelKey: string;
  href: string;
  mega?: boolean;
  sections?: NavMegaSection[];
  featured?: NavFeaturedPanel;
  children?: NavLinkItem[];
  /** Resolved at runtime */
  label?: string;
};

export const PROPERTY_MEGA_SECTIONS: NavMegaSection[] = [
  {
    titleKey: "megaPropertyType",
    items: [
      { labelKey: "megaResidentialHouses", href: "/properties?type=HOUSE", descriptionKey: "megaResidentialHousesDesc", icon: Home },
      { labelKey: "megaResidentialApartments", href: "/properties?type=APARTMENT", descriptionKey: "megaResidentialApartmentsDesc", icon: Building2 },
      { labelKey: "megaCommercialProperty", href: "/properties?type=COMMERCIAL", descriptionKey: "megaCommercialPropertyDesc", icon: Store },
      { labelKey: "megaPlotsOfLand", href: "/properties?type=LAND", descriptionKey: "megaPlotsOfLandDesc", icon: LandPlot },
      { labelKey: "megaOfficeSpaces", href: "/properties?type=OFFICE", descriptionKey: "megaOfficeSpacesDesc", icon: Building },
      { labelKey: "megaWarehouses", href: "/properties?type=WAREHOUSE", descriptionKey: "megaWarehousesDesc", icon: Warehouse },
    ],
  },
  {
    titleKey: "megaBuyOrRent",
    items: [
      { labelKey: "megaForSale", href: "/properties?purpose=SALE", descriptionKey: "megaForSaleDesc", icon: Tag, badgeKey: "badgeBuy" },
      { labelKey: "megaForRent", href: "/properties?purpose=RENT", descriptionKey: "megaForRentDesc", icon: Key, badgeKey: "badgeRent" },
      { labelKey: "megaFeaturedListings", href: "/properties?featured=true", descriptionKey: "megaFeaturedListingsDesc", icon: Star },
    ],
  },
  {
    titleKey: "megaPopularLocations",
    items: [
      { labelKey: "locKimihurura", href: "/properties?q=Kimihurura", icon: MapPin },
      { labelKey: "locNyarutarama", href: "/properties?q=Nyarutarama", icon: MapPin },
      { labelKey: "locKacyiru", href: "/properties?q=Kacyiru", icon: MapPin },
      { labelKey: "locGacuriro", href: "/properties?q=Gacuriro", icon: MapPin },
      { labelKey: "locKagugu", href: "/properties?q=Kagugu", icon: MapPin },
      { labelKey: "locRemera", href: "/properties?q=Remera", icon: MapPin },
    ],
  },
  {
    titleKey: "megaSpecialListings",
    items: [
      { labelKey: "megaJointVenture", href: "/contact?type=PROPERTY", descriptionKey: "megaJointVentureDesc", icon: Handshake },
      { labelKey: "megaOffPlan", href: "/contact?type=PROPERTY", descriptionKey: "megaOffPlanDesc", icon: HardHat },
      { labelKey: "megaCoListing", href: "/contact?type=PROPERTY", descriptionKey: "megaCoListingDesc", icon: Users },
      { labelKey: "megaListYourProperty", href: "/contact?type=PROPERTY", descriptionKey: "megaListYourPropertyDesc", icon: Phone },
    ],
  },
];

export const SERVICES_MEGA_SECTIONS: NavMegaSection[] = [
  {
    titleKey: "megaDesignPlanning",
    items: [
      { labelKey: "architecture", href: "/services/architecture", descriptionKey: "megaArchitectureDesc", icon: PenTool },
      { labelKey: "megaBoqQuotations", href: "/services/architecture", descriptionKey: "megaBoqQuotationsDesc", icon: ClipboardList },
      { labelKey: "interiorDesign", href: "/services/interior-design", descriptionKey: "megaInteriorDesignDesc", icon: Ruler },
    ],
  },
  {
    titleKey: "megaBuildDeliver",
    items: [
      { labelKey: "construction", href: "/services/construction", descriptionKey: "megaConstructionDesc", icon: Hammer },
      { labelKey: "megaProjectManagement", href: "/services/project-management", descriptionKey: "megaProjectManagementDesc", icon: HardHat },
      { labelKey: "megaRenovation", href: "/services/construction", descriptionKey: "megaRenovationDesc", icon: Layers },
    ],
  },
  {
    titleKey: "megaRealEstateServices",
    items: [
      { labelKey: "megaBuySell", href: "/services/real-estate", descriptionKey: "megaBuySellDesc", icon: Building2 },
      { labelKey: "megaPropertyManagement", href: "/services/real-estate", descriptionKey: "megaPropertyManagementDesc", icon: Key },
      { labelKey: "megaInvestmentAdvisory", href: "/contact?type=PROPERTY", descriptionKey: "megaInvestmentAdvisoryDesc", icon: Briefcase },
    ],
  },
];

export const MATERIALS_MEGA_SECTIONS: NavMegaSection[] = [
  {
    titleKey: "megaStructuralMaterials",
    items: [
      { labelKey: "megaCementConcrete", href: "/materials?q=cement", descriptionKey: "megaCementConcreteDesc", icon: Package },
      { labelKey: "megaSteelRebar", href: "/materials?q=steel", descriptionKey: "megaSteelRebarDesc", icon: Layers },
      { labelKey: "megaBlocksBricks", href: "/materials?q=blocks", descriptionKey: "megaBlocksBricksDesc", icon: Building },
    ],
  },
  {
    titleKey: "megaFinishesMep",
    items: [
      { labelKey: "megaTilesFlooring", href: "/materials?q=tiles", descriptionKey: "megaTilesFlooringDesc", icon: PaintBucket },
      { labelKey: "megaRoofing", href: "/materials?q=roofing", descriptionKey: "megaRoofingDesc", icon: Home },
      { labelKey: "megaPlumbing", href: "/materials?q=plumbing", descriptionKey: "megaPlumbingDesc", icon: Pipette },
      { labelKey: "megaElectrical", href: "/materials?q=electrical", descriptionKey: "megaElectricalDesc", icon: Zap },
    ],
  },
  {
    titleKey: "megaOrderDelivery",
    items: [
      { labelKey: "megaBrowseCatalog", href: "/materials", descriptionKey: "megaBrowseCatalogDesc", icon: Package },
      { labelKey: "megaBulkOrder", href: "/contact?type=MATERIAL", descriptionKey: "megaBulkOrderDesc", icon: ClipboardList },
      { labelKey: "megaSiteDelivery", href: "/contact?type=MATERIAL", descriptionKey: "megaSiteDeliveryDesc", icon: Truck },
    ],
  },
];

export const COMPANY_MEGA_SECTIONS: NavMegaSection[] = [
  {
    titleKey: "megaAboutGreenRock",
    items: [
      { labelKey: "megaOurStory", href: "/about", descriptionKey: "megaOurStoryDesc", icon: Building2 },
      { labelKey: "ourTeam", href: "/about#team", descriptionKey: "megaOurTeamDesc", icon: Users },
      { labelKey: "partners", href: "/about#partners", descriptionKey: "megaPartnersDesc", icon: Handshake },
      { labelKey: "careers", href: "/careers", descriptionKey: "megaCareersDesc", icon: Briefcase },
    ],
  },
  {
    titleKey: "megaResources",
    items: [
      { labelKey: "megaBlogInsights", href: "/blog", descriptionKey: "megaBlogInsightsDesc", icon: BookOpen },
      { labelKey: "megaProjectGallery", href: "/gallery", descriptionKey: "megaProjectGalleryDesc", icon: Image },
      { labelKey: "faq", href: "/faq", descriptionKey: "megaFaqDesc", icon: HelpCircle },
      { labelKey: "footerPrivacy", href: "/privacy", descriptionKey: "megaPrivacyDesc", icon: FileText },
    ],
  },
];

/** @deprecated Use getLocalizedSearchCategories(locale) */
export const PROPERTY_SEARCH_CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "HOUSE", label: "Residential Houses" },
  { value: "APARTMENT", label: "Residential Apartments" },
  { value: "COMMERCIAL", label: "Commercial Property" },
  { value: "LAND", label: "Plots of Land" },
  { value: "OFFICE", label: "Office Spaces" },
  { value: "WAREHOUSE", label: "Warehouses" },
] as const;

/** @deprecated Use getLocalizedPriceRanges(locale) */
export const PROPERTY_PRICE_RANGES = [
  { value: "ALL", label: "Any Price" },
  { value: "0-50000000", label: "Under 50M RWF" },
  { value: "50000000-150000000", label: "50M – 150M RWF" },
  { value: "150000000-500000000", label: "150M – 500M RWF" },
  { value: "500000000+", label: "500M+ RWF" },
] as const;

export const NAV_LINKS: NavItem[] = [
  { labelKey: "navHome", href: "/" },
  {
    labelKey: "navProperties",
    href: "/properties",
    mega: true,
    sections: PROPERTY_MEGA_SECTIONS,
    featured: {
      titleKey: "featPropertiesTitle",
      descriptionKey: "featPropertiesDesc",
      href: "/properties",
      ctaKey: "featPropertiesCta",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    },
  },
  {
    labelKey: "navServices",
    href: "/services",
    mega: true,
    sections: SERVICES_MEGA_SECTIONS,
    featured: {
      titleKey: "featServicesTitle",
      descriptionKey: "featServicesDesc",
      href: "/contact?type=CONSTRUCTION",
      ctaKey: "featServicesCta",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
    },
  },
  {
    labelKey: "navMaterials",
    href: "/materials",
    mega: true,
    sections: MATERIALS_MEGA_SECTIONS,
    featured: {
      titleKey: "featMaterialsTitle",
      descriptionKey: "featMaterialsDesc",
      href: "/materials",
      ctaKey: "featMaterialsCta",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
    },
  },
  { labelKey: "navProjects", href: "/projects" },
  {
    labelKey: "navCompany",
    href: "/about",
    mega: true,
    sections: COMPANY_MEGA_SECTIONS,
    featured: {
      titleKey: "featCompanyTitle",
      descriptionKey: "featCompanyDesc",
      href: "/about",
      ctaKey: "featCompanyCta",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
    },
  },
  { labelKey: "navContact", href: "/contact" },
];
