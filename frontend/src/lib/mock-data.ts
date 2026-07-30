import type { Property, Project, Product, Service, Testimonial, Blog, Career, Partner, Category, User } from "@/types";

export const MOCK_PROPERTIES: Property[] = [
  { id: "1", slug: "luxury-villa-kigali", title: "Luxury Villa in Kigali", description: "Stunning modern villa with panoramic city views.", price: 850000000, currency: "RWF", location: "Kigali, Kimihurura", bedrooms: 5, bathrooms: 4, area: 450, areaUnit: "sqm", propertyType: "HOUSE", purpose: "SALE", status: "AVAILABLE", featured: true, amenities: ["Pool", "Garden"], images: [{ id: "1", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", order: 0, propertyId: "1", createdAt: "" }], createdAt: "", updatedAt: "" },
  { id: "2", slug: "modern-apartment-nyarutarama", title: "Modern Apartment", description: "Fully furnished apartment in prime location.", price: 450000, currency: "RWF", location: "Nyarutarama, Kigali", bedrooms: 3, bathrooms: 2, area: 120, areaUnit: "sqm", propertyType: "APARTMENT", purpose: "RENT", status: "AVAILABLE", featured: true, amenities: ["Parking", "Security"], images: [{ id: "2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", order: 0, propertyId: "2", createdAt: "" }], createdAt: "", updatedAt: "" },
  { id: "3", slug: "commercial-space-cbd", title: "Commercial Space CBD", description: "Prime commercial property in central business district.", price: 1200000000, currency: "RWF", location: "Kigali CBD", bedrooms: 0, bathrooms: 2, area: 800, areaUnit: "sqm", propertyType: "COMMERCIAL", purpose: "SALE", status: "AVAILABLE", featured: false, amenities: ["Elevator", "Parking"], images: [{ id: "3", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", order: 0, propertyId: "3", createdAt: "" }], createdAt: "", updatedAt: "" },
];

export const MOCK_PROJECTS: Project[] = [
  { id: "1", slug: "green-heights-residence", title: "Green Heights Residence", description: "Premium residential complex with 48 luxury units.", location: "Kigali", status: "COMPLETED", client: "Private Developer", completionDate: "2025-06-01", featured: true, servicesUsed: ["Construction", "Interior Design"], images: [{ id: "1", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", order: 0, projectId: "1", createdAt: "" }], createdAt: "", updatedAt: "" },
  { id: "2", slug: "kigali-business-park", title: "Kigali Business Park", description: "Modern commercial development with office spaces.", location: "Kigali", status: "ONGOING", client: "Green Rock Ltd", featured: true, servicesUsed: ["Construction", "Project Management"], images: [{ id: "2", url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80", order: 0, projectId: "2", createdAt: "" }], createdAt: "", updatedAt: "" },
  { id: "3", slug: "timber-processing-facility", title: "Timber Processing Facility", description: "State-of-the-art timber processing center.", location: "Musanze", status: "UPCOMING", client: "Green Rock Ltd", featured: false, servicesUsed: ["Construction", "Timber"], images: [{ id: "3", url: "https://images.unsplash.com/photo-1513828583688-c52645db1e51?w=800&q=80", order: 0, projectId: "3", createdAt: "" }], createdAt: "", updatedAt: "" },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", slug: "portland-cement-50kg", name: "Portland Cement 50kg", description: "Premium quality cement for all construction needs.", price: 12000, currency: "RWF", stock: 500, availability: true, deliveryOption: true, deliveryCharge: 5000, featured: false, images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80"], categoryId: "1", category: { id: "1", name: "Cement", slug: "cement", order: 1, isActive: true, createdAt: "", updatedAt: "" } satisfies Category, createdAt: "", updatedAt: "" },
  { id: "2", slug: "steel-rebar-12mm", name: "Steel Rebar 12mm", description: "High-grade steel reinforcement bars.", price: 8500, currency: "RWF", stock: 200, availability: true, deliveryOption: true, featured: false, images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80"], categoryId: "2", category: { id: "2", name: "Steel", slug: "steel", order: 2, isActive: true, createdAt: "", updatedAt: "" } satisfies Category, createdAt: "", updatedAt: "" },
  { id: "3", slug: "ceramic-floor-tiles", name: "Ceramic Floor Tiles", description: "Premium ceramic tiles in various designs.", price: 15000, currency: "RWF", stock: 1000, availability: true, deliveryOption: true, featured: false, images: ["https://images.unsplash.com/photo-1615971677496-40a0a834d2a4?w=400&q=80"], categoryId: "3", category: { id: "3", name: "Tiles", slug: "tiles", order: 3, isActive: true, createdAt: "", updatedAt: "" } satisfies Category, createdAt: "", updatedAt: "" },
];

export const MOCK_SERVICES: Service[] = [
  { id: "0", slug: "architecture", title: "Architecture & Drawings", description: "House drawings, architectural plans, and detailed quotations for your building project.", icon: "PenTool", featured: true, order: 0, isActive: true, createdAt: "", updatedAt: "" },
  { id: "1", slug: "real-estate", title: "Real Estate", description: "Buy, sell, rent and list premium properties across Rwanda.", icon: "Building2", featured: true, order: 1, isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", slug: "construction", title: "Construction", description: "Residential, commercial and infrastructure construction services.", icon: "HardHat", featured: true, order: 2, isActive: true, createdAt: "", updatedAt: "" },
  { id: "3", slug: "building-materials", title: "Building Materials", description: "Quality cement, steel, tiles, paint and more with delivery.", icon: "Package", featured: true, order: 3, isActive: true, createdAt: "", updatedAt: "" },
  { id: "4", slug: "interior-design", title: "Interior Design", description: "Luxury interior design for homes, offices and commercial spaces.", icon: "Palette", featured: true, order: 4, isActive: true, createdAt: "", updatedAt: "" },
  { id: "5", slug: "painting", title: "Painting Services", description: "Interior, exterior and industrial painting solutions.", icon: "Paintbrush", featured: false, order: 5, isActive: true, createdAt: "", updatedAt: "" },
  { id: "6", slug: "timber", title: "Timber Sales", description: "Quality timber sales, processing and wood construction.", icon: "TreePine", featured: false, order: 6, isActive: true, createdAt: "", updatedAt: "" },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "1", name: "Jean Pierre N.", role: "Property Owner", content: "Green Rock delivered our dream home on time and within budget. Exceptional quality!", rating: 5, featured: true, isActive: true, createdAt: "" },
  { id: "2", name: "Marie Claire U.", role: "Business Owner", content: "Their building materials are top quality and delivery is always prompt.", rating: 5, featured: true, isActive: true, createdAt: "" },
  { id: "3", name: "Patrick M.", role: "Developer", content: "Professional team, excellent project management. Highly recommended.", rating: 5, featured: true, isActive: true, createdAt: "" },
];

export const MOCK_BLOG: Blog[] = [
  { id: "1", slug: "choosing-building-materials", title: "How to Choose Quality Building Materials", excerpt: "Essential guide for selecting the right materials for your construction project.", content: "", category: "Construction Tips", tags: [], authorId: "1", author: { id: "1", name: "Admin", email: "admin@greenrock.com", role: "ADMIN", isActive: true, createdAt: "", updatedAt: "" } satisfies User, published: true, publishedAt: "2026-03-15", views: 0, coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", createdAt: "", updatedAt: "" },
  { id: "2", slug: "kigali-real-estate-2026", title: "Kigali Real Estate Market Trends 2026", excerpt: "Analysis of the latest trends in Rwanda's growing property market.", content: "", category: "Real Estate News", tags: [], authorId: "1", author: { id: "1", name: "Admin", email: "admin@greenrock.com", role: "ADMIN", isActive: true, createdAt: "", updatedAt: "" } satisfies User, published: true, publishedAt: "2026-03-01", views: 0, coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", createdAt: "", updatedAt: "" },
];

export const MOCK_CAREERS: Career[] = [
  { id: "1", slug: "senior-project-manager", title: "Senior Project Manager", department: "Construction", location: "Kigali", type: "Full-time", description: "Lead construction projects from planning to completion.", requirements: "5+ years experience in construction management.", deadline: "2026-08-30", isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", slug: "real-estate-agent", title: "Real Estate Agent", department: "Sales", location: "Kigali", type: "Full-time", description: "Help clients buy, sell and rent properties.", requirements: "Real estate license and 2+ years experience.", deadline: "2026-08-15", isActive: true, createdAt: "", updatedAt: "" },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: "1", name: "Rwanda Housing Authority", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80", order: 1, isActive: true, createdAt: "" },
  { id: "2", name: "CIMERWA", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80", order: 2, isActive: true, createdAt: "" },
  { id: "3", name: "Bank of Kigali", logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80", order: 3, isActive: true, createdAt: "" },
  { id: "4", name: "RDB", logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80", order: 4, isActive: true, createdAt: "" },
];

export const TEAM = [
  { name: "Emmanuel Green", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Alice Mukamana", role: "COO", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "David Nshuti", role: "Head of Construction", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Grace Uwimana", role: "Real Estate Director", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];
