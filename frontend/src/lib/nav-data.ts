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
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
};

export type NavMegaSection = {
  title: string;
  items: NavLinkItem[];
};

export type NavFeaturedPanel = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
};

export type NavItem = {
  label: string;
  href: string;
  mega?: boolean;
  sections?: NavMegaSection[];
  featured?: NavFeaturedPanel;
  children?: NavLinkItem[];
};

export const PROPERTY_MEGA_SECTIONS: NavMegaSection[] = [
  {
    title: "Property Type",
    items: [
      { label: "Residential Houses", href: "/properties?type=HOUSE", description: "Villas, homes & townhouses", icon: Home },
      { label: "Residential Apartments", href: "/properties?type=APARTMENT", description: "Flats & luxury units", icon: Building2 },
      { label: "Commercial Property", href: "/properties?type=COMMERCIAL", description: "Offices, retail & warehouses", icon: Store },
      { label: "Plots of Land", href: "/properties?type=LAND", description: "Residential & commercial plots", icon: LandPlot },
      { label: "Office Spaces", href: "/properties?type=OFFICE", description: "Professional workspaces", icon: Building },
      { label: "Warehouses", href: "/properties?type=WAREHOUSE", description: "Industrial & storage", icon: Warehouse },
    ],
  },
  {
    title: "Buy or Rent",
    items: [
      { label: "Properties For Sale", href: "/properties?purpose=SALE", description: "Own your next asset", icon: Tag, badge: "Buy" },
      { label: "Properties For Rent", href: "/properties?purpose=RENT", description: "Monthly rentals", icon: Key, badge: "Rent" },
      { label: "Featured Listings", href: "/properties?featured=true", description: "Handpicked by our team", icon: Star },
    ],
  },
  {
    title: "Popular Locations",
    items: [
      { label: "Kimihurura", href: "/properties?q=Kimihurura", icon: MapPin },
      { label: "Nyarutarama", href: "/properties?q=Nyarutarama", icon: MapPin },
      { label: "Kacyiru", href: "/properties?q=Kacyiru", icon: MapPin },
      { label: "Gacuriro", href: "/properties?q=Gacuriro", icon: MapPin },
      { label: "Kagugu", href: "/properties?q=Kagugu", icon: MapPin },
      { label: "Remera", href: "/properties?q=Remera", icon: MapPin },
    ],
  },
  {
    title: "Special Listings",
    items: [
      { label: "Joint Venture", href: "/contact?type=PROPERTY", description: "Partner on prime developments", icon: Handshake },
      { label: "Off-Plan Properties", href: "/contact?type=PROPERTY", description: "Pre-construction investments", icon: HardHat },
      { label: "Co-Listing", href: "/contact?type=PROPERTY", description: "List with Green Rock agents", icon: Users },
      { label: "List Your Property", href: "/contact?type=PROPERTY", description: "Sell or rent with us", icon: Phone },
    ],
  },
];

export const SERVICES_MEGA_SECTIONS: NavMegaSection[] = [
  {
    title: "Design & Planning",
    items: [
      { label: "Architecture & Drawings", href: "/services/architecture", description: "House plans & 3D visuals", icon: PenTool },
      { label: "BOQ & Quotations", href: "/services/architecture", description: "Detailed cost estimates", icon: ClipboardList },
      { label: "Interior Design", href: "/services/interior-design", description: "Luxury finishing concepts", icon: Ruler },
    ],
  },
  {
    title: "Build & Deliver",
    items: [
      { label: "Construction", href: "/services/construction", description: "Residential & commercial builds", icon: Hammer },
      { label: "Project Management", href: "/services/project-management", description: "End-to-end site delivery", icon: HardHat },
      { label: "Renovation & Finishing", href: "/services/construction", description: "Upgrades & fit-outs", icon: Layers },
    ],
  },
  {
    title: "Real Estate Services",
    items: [
      { label: "Buy & Sell", href: "/services/real-estate", description: "Transaction advisory", icon: Building2 },
      { label: "Property Management", href: "/services/real-estate", description: "Tenant & asset care", icon: Key },
      { label: "Investment Advisory", href: "/contact?type=PROPERTY", description: "Portfolio guidance", icon: Briefcase },
    ],
  },
];

export const MATERIALS_MEGA_SECTIONS: NavMegaSection[] = [
  {
    title: "Structural Materials",
    items: [
      { label: "Cement & Concrete", href: "/materials?q=cement", description: "Portland & ready-mix", icon: Package },
      { label: "Steel & Rebar", href: "/materials?q=steel", description: "Reinforcement supplies", icon: Layers },
      { label: "Blocks & Bricks", href: "/materials?q=blocks", description: "Masonry units", icon: Building },
    ],
  },
  {
    title: "Finishes & MEP",
    items: [
      { label: "Tiles & Flooring", href: "/materials?q=tiles", description: "Ceramic, porcelain & stone", icon: PaintBucket },
      { label: "Roofing Materials", href: "/materials?q=roofing", description: "Sheets, trusses & gutters", icon: Home },
      { label: "Plumbing Supplies", href: "/materials?q=plumbing", description: "Pipes, fittings & fixtures", icon: Pipette },
      { label: "Electrical Supplies", href: "/materials?q=electrical", description: "Cables, switches & panels", icon: Zap },
    ],
  },
  {
    title: "Order & Delivery",
    items: [
      { label: "Browse Full Catalog", href: "/materials", description: "All building materials", icon: Package },
      { label: "Bulk Order Quote", href: "/contact?type=MATERIAL", description: "Volume pricing", icon: ClipboardList },
      { label: "Site Delivery", href: "/contact?type=MATERIAL", description: "Nationwide dispatch", icon: Truck },
    ],
  },
];

export const COMPANY_MEGA_SECTIONS: NavMegaSection[] = [
  {
    title: "About Green Rock",
    items: [
      { label: "Our Story", href: "/about", description: "Mission, vision & values", icon: Building2 },
      { label: "Our Team", href: "/about#team", description: "Meet the experts", icon: Users },
      { label: "Partners", href: "/about#partners", description: "Industry collaborators", icon: Handshake },
      { label: "Careers", href: "/careers", description: "Join our growing team", icon: Briefcase },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Blog & Insights", href: "/blog", description: "Market news & tips", icon: BookOpen },
      { label: "Project Gallery", href: "/gallery", description: "Completed work showcase", icon: Image },
      { label: "FAQ", href: "/faq", description: "Common questions answered", icon: HelpCircle },
      { label: "Privacy Policy", href: "/privacy", description: "Data & privacy", icon: FileText },
    ],
  },
];

export const PROPERTY_SEARCH_CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "HOUSE", label: "Residential Houses" },
  { value: "APARTMENT", label: "Residential Apartments" },
  { value: "COMMERCIAL", label: "Commercial Property" },
  { value: "LAND", label: "Plots of Land" },
  { value: "OFFICE", label: "Office Spaces" },
  { value: "WAREHOUSE", label: "Warehouses" },
] as const;

export const PROPERTY_PRICE_RANGES = [
  { value: "ALL", label: "Any Price" },
  { value: "0-50000000", label: "Under 50M RWF" },
  { value: "50000000-150000000", label: "50M – 150M RWF" },
  { value: "150000000-500000000", label: "150M – 500M RWF" },
  { value: "500000000+", label: "500M+ RWF" },
] as const;

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "/properties",
    mega: true,
    sections: PROPERTY_MEGA_SECTIONS,
    featured: {
      title: "Find Your Property in Rwanda",
      description: "Browse premium listings across Kigali and beyond — sale, rent, land & commercial.",
      href: "/properties",
      cta: "View All Properties",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    },
  },
  {
    label: "Services",
    href: "/services",
    mega: true,
    sections: SERVICES_MEGA_SECTIONS,
    featured: {
      title: "Architecture to Handover",
      description: "Drawings, quotations, construction & project management under one roof.",
      href: "/contact?type=CONSTRUCTION",
      cta: "Request a Quote",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
    },
  },
  {
    label: "Materials",
    href: "/materials",
    mega: true,
    sections: MATERIALS_MEGA_SECTIONS,
    featured: {
      title: "Quality Building Supplies",
      description: "Cement, steel, tiles & more — bulk orders with reliable site delivery.",
      href: "/materials",
      cta: "Shop Materials",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
    },
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Company",
    href: "/about",
    mega: true,
    sections: COMPANY_MEGA_SECTIONS,
    featured: {
      title: "Green Rock General Supply Ltd",
      description: "Trusted construction, real estate & materials partner since 2010.",
      href: "/about",
      cta: "Learn About Us",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
    },
  },
  { label: "Contact", href: "/contact" },
];
