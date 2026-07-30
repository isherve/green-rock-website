import type { FieldDef } from "@/components/admin/AdminCRUD";

/** Stable reference — avoids AdminCRUD refetch loops when passed as listParams */
export const ADMIN_LIST_ALL = { showAll: "true" } as const;

const propertyTypes = [
  { value: "HOUSE", label: "House" }, { value: "APARTMENT", label: "Apartment" },
  { value: "LAND", label: "Land" }, { value: "COMMERCIAL", label: "Commercial" },
  { value: "OFFICE", label: "Office" }, { value: "WAREHOUSE", label: "Warehouse" },
];
const purposes = [{ value: "SALE", label: "Sale" }, { value: "RENT", label: "Rent" }, { value: "BOTH", label: "Both" }];
const statuses = [
  { value: "AVAILABLE", label: "Available" }, { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" }, { value: "PENDING", label: "Pending" }, { value: "FEATURED", label: "Featured" },
];
const projectStatuses = [
  { value: "COMPLETED", label: "Completed" }, { value: "ONGOING", label: "Ongoing" }, { value: "UPCOMING", label: "Upcoming" },
];
const galleryCategories = [
  { value: "PROJECT", label: "Project" }, { value: "PROPERTY", label: "Property" },
  { value: "CONSTRUCTION", label: "Construction" }, { value: "INTERIOR", label: "Interior" }, { value: "GENERAL", label: "General" },
];
const roles = [
  { value: "USER", label: "User" }, { value: "AGENT", label: "Agent" },
  { value: "MANAGER", label: "Manager" }, { value: "ADMIN", label: "Admin" },
];
const blogCategories = [
  "Construction Tips", "Real Estate News", "Interior Design", "Painting", "Architecture",
].map((c) => ({ value: c, label: c }));

export const PROPERTY_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
  { name: "price", label: "Price (RWF)", type: "number", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "address", label: "Address", type: "text" },
  { name: "bedrooms", label: "Bedrooms", type: "number" },
  { name: "bathrooms", label: "Bathrooms", type: "number" },
  { name: "area", label: "Area (sqm)", type: "number" },
  { name: "propertyType", label: "Type", type: "select", required: true, options: propertyTypes, defaultValue: "HOUSE" },
  { name: "purpose", label: "Purpose", type: "select", required: true, options: purposes, defaultValue: "SALE" },
  { name: "status", label: "Status", type: "select", options: statuses, defaultValue: "AVAILABLE" },
  { name: "imageUrls", label: "Photos", type: "images" },
  { name: "amenities", label: "Amenities (comma separated)", type: "text" },
  { name: "featured", label: "Featured listing", type: "boolean", defaultValue: false },
];

export const PROJECT_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "client", label: "Client", type: "text" },
  { name: "status", label: "Status", type: "select", options: projectStatuses, defaultValue: "ONGOING" },
  { name: "servicesUsed", label: "Services (comma separated)", type: "text" },
  { name: "imageUrls", label: "Photos", type: "images" },
  { name: "featured", label: "Featured", type: "boolean", defaultValue: false },
];

export const PRODUCT_FIELDS: FieldDef[] = [
  { name: "name", label: "Product Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
  { name: "price", label: "Price (RWF)", type: "number", required: true },
  { name: "categoryId", label: "Category", type: "select", required: true, loadOptionsKey: "categories" },
  { name: "stock", label: "Stock", type: "number", defaultValue: 0 },
  { name: "imageUrls", label: "Photos", type: "images" },
  { name: "availability", label: "Available", type: "boolean", defaultValue: true },
  { name: "deliveryOption", label: "Delivery available", type: "boolean", defaultValue: true },
  { name: "deliveryCharge", label: "Delivery charge (RWF)", type: "number" },
  { name: "featured", label: "Featured", type: "boolean", defaultValue: false },
];

export const BLOG_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
  { name: "content", label: "Content", type: "textarea", required: true, rows: 8 },
  { name: "category", label: "Category", type: "select", required: true, options: blogCategories },
  { name: "coverImage", label: "Cover Image", type: "image" },
  { name: "tags", label: "Tags (comma separated)", type: "text" },
  { name: "published", label: "Published", type: "boolean", defaultValue: false },
];

export const CAREER_FIELDS: FieldDef[] = [
  { name: "title", label: "Job Title", type: "text", required: true },
  { name: "department", label: "Department", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "type", label: "Employment Type", type: "text", defaultValue: "Full-time" },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
  { name: "requirements", label: "Requirements", type: "textarea", required: true, rows: 4 },
  { name: "salary", label: "Salary range", type: "text" },
  { name: "isActive", label: "Active listing", type: "boolean", defaultValue: true },
];

export const GALLERY_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "url", label: "Media", type: "image", required: true },
  { name: "type", label: "Type", type: "select", options: [{ value: "IMAGE", label: "Image" }, { value: "VIDEO", label: "Video" }], defaultValue: "IMAGE" },
  { name: "category", label: "Category", type: "select", options: galleryCategories, defaultValue: "GENERAL" },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "featured", label: "Featured", type: "boolean", defaultValue: false },
];

export const USER_FIELDS: FieldDef[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "password", label: "Password", type: "password", requiredOnCreate: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "role", label: "Role", type: "select", options: roles, defaultValue: "USER" },
  { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
];

export function propertyToForm(item: Record<string, unknown>) {
  const images = item.images as { url: string }[] | undefined;
  return {
    ...item,
    imageUrls: images?.map((i) => i.url) ?? [],
    amenities: Array.isArray(item.amenities) ? (item.amenities as string[]).join(", ") : "",
  };
}

export function propertyToPayload(form: Record<string, unknown>) {
  const imageUrls = (form.imageUrls as string[]) || [];
  const amenities = String(form.amenities || "").split(",").map((s) => s.trim()).filter(Boolean);
  const { imageUrls: _, amenities: __, ...rest } = form;
  return {
    ...rest,
    price: Number(form.price),
    bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
    bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
    area: form.area ? Number(form.area) : undefined,
    amenities,
    images: imageUrls.map((url, order) => ({ url, order })),
  };
}

export function projectToForm(item: Record<string, unknown>) {
  const images = item.images as { url: string }[] | undefined;
  return {
    ...item,
    imageUrls: images?.map((i) => i.url) ?? [],
    servicesUsed: Array.isArray(item.servicesUsed) ? (item.servicesUsed as string[]).join(", ") : "",
  };
}

export function projectToPayload(form: Record<string, unknown>) {
  const imageUrls = (form.imageUrls as string[]) || [];
  const servicesUsed = String(form.servicesUsed || "").split(",").map((s) => s.trim()).filter(Boolean);
  const { imageUrls: _, servicesUsed: __, ...rest } = form;
  return { ...rest, servicesUsed, images: imageUrls.map((url, order) => ({ url, order })) };
}

export function productToForm(item: Record<string, unknown>) {
  return {
    ...item,
    imageUrls: Array.isArray(item.images) ? item.images as string[] : [],
    categoryId: (item.category as { id: string })?.id ?? item.categoryId,
  };
}

export function productToPayload(form: Record<string, unknown>) {
  const { imageUrls, ...rest } = form;
  return {
    ...rest,
    price: Number(form.price),
    stock: Number(form.stock || 0),
    deliveryCharge: form.deliveryCharge ? Number(form.deliveryCharge) : undefined,
    images: (imageUrls as string[]) || [],
  };
}

export function blogToForm(item: Record<string, unknown>) {
  return {
    ...item,
    tags: Array.isArray(item.tags) ? (item.tags as string[]).join(", ") : "",
  };
}

export function blogToPayload(form: Record<string, unknown>) {
  const tags = String(form.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
  const { tags: _, ...rest } = form;
  return { ...rest, tags };
}

export const TESTIMONIAL_FIELDS: FieldDef[] = [
  { name: "name", label: "Client Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "content", label: "Testimonial", type: "textarea", required: true, rows: 4 },
  { name: "avatar", label: "Photo", type: "image" },
  { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: 5 },
  { name: "featured", label: "Featured", type: "boolean", defaultValue: false },
  { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
];

export const CATEGORY_FIELDS: FieldDef[] = [
  { name: "name", label: "Category Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "image", label: "Image", type: "image" },
  { name: "order", label: "Sort Order", type: "number", defaultValue: 0 },
  { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
];

export const SERVICE_FIELDS: FieldDef[] = [
  { name: "title", label: "Service Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
  { name: "icon", label: "Icon name (Lucide)", type: "text" },
  { name: "image", label: "Image", type: "image" },
  { name: "featured", label: "Featured", type: "boolean", defaultValue: false },
  { name: "order", label: "Sort Order", type: "number", defaultValue: 0 },
  { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
];

export function testimonialToPayload(form: Record<string, unknown>) {
  return { ...form, rating: Number(form.rating || 5) };
}

export function userToPayload(form: Record<string, unknown>, isEdit: boolean) {
  const payload: Record<string, unknown> = { ...form };
  if (isEdit && !payload.password) delete payload.password;
  return payload;
}

export const PARTNER_FIELDS: FieldDef[] = [
  { name: "name", label: "Partner Name", type: "text", required: true },
  { name: "logo", label: "Logo", type: "image", required: true },
  { name: "website", label: "Website URL", type: "text" },
  { name: "order", label: "Sort Order", type: "number", defaultValue: 0 },
  { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
];
