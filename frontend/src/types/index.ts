// Enums matching backend Prisma schema
export type Role = "ADMIN" | "MANAGER" | "AGENT" | "USER";

export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "LAND"
  | "COMMERCIAL"
  | "OFFICE"
  | "WAREHOUSE";

export type PropertyPurpose = "SALE" | "RENT" | "BOTH";

export type PropertyStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RENTED"
  | "PENDING"
  | "FEATURED";

export type ProjectStatus = "COMPLETED" | "ONGOING" | "UPCOMING";

export type InquiryType =
  | "QUOTE"
  | "PROPERTY"
  | "MATERIAL"
  | "CONSTRUCTION"
  | "GENERAL"
  | "APPOINTMENT";

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

export type GalleryType = "IMAGE" | "VIDEO";

export type GalleryCategory =
  | "PROJECT"
  | "PROPERTY"
  | "CONSTRUCTION"
  | "INTERIOR"
  | "GENERAL";

// Models
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  description: string;
  descriptionFr?: string | null;
  descriptionRw?: string | null;
  icon?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: Service | null;
  children?: Service[];
  featured: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
  propertyId: string;
  createdAt: string;
}

export interface PropertyVideo {
  id: string;
  url: string;
  title?: string | null;
  propertyId: string;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  slug: string;
  description: string;
  descriptionFr?: string | null;
  descriptionRw?: string | null;
  price: number;
  currency: string;
  location: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  areaUnit: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  featured: boolean;
  amenities: string[];
  agentId?: string | null;
  agent?: User | null;
  images?: PropertyImage[];
  videos?: PropertyVideo[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  slug: string;
  description: string;
  descriptionFr?: string | null;
  descriptionRw?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  client?: string | null;
  completionDate?: string | null;
  status: ProjectStatus;
  servicesUsed: string[];
  featured: boolean;
  images?: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameFr?: string | null;
  nameRw?: string | null;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameFr?: string | null;
  nameRw?: string | null;
  slug: string;
  description: string;
  descriptionFr?: string | null;
  descriptionRw?: string | null;
  price: number;
  currency: string;
  stock: number;
  availability: boolean;
  deliveryOption: boolean;
  deliveryCharge?: number | null;
  featured: boolean;
  images: string[];
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  propertyId?: string | null;
  property?: Property | null;
  productId?: string | null;
  product?: Product | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service?: string | null;
  message?: string | null;
  propertyId?: string | null;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary?: string | null;
  deadline?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  careerId: string;
  career?: Career;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  reviewedById?: string | null;
  reviewedBy?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  slug: string;
  excerpt: string;
  content: string;
  contentFr?: string | null;
  contentRw?: string | null;
  coverImage?: string | null;
  category: string;
  tags: string[];
  authorId: string;
  author?: User;
  published: boolean;
  publishedAt?: string | null;
  views: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  blogId: string;
  authorId?: string | null;
  author?: User | null;
  name: string;
  email: string;
  approved: boolean;
  createdAt: string;
}

export interface Gallery {
  id: string;
  title: string;
  titleFr?: string | null;
  titleRw?: string | null;
  type: GalleryType;
  category: GalleryCategory;
  url: string;
  thumbnail?: string | null;
  description?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  contentFr?: string | null;
  contentRw?: string | null;
  avatar?: string | null;
  rating: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  user?: User;
  propertyId: string;
  property?: Property;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updatedAt: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
