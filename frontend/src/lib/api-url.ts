/** Resolve API base URL for browser, SSR, and Vercel (same-origin /api). */
export function getApiBaseUrl(): string {
  // Browser: always same-origin so login works on any Vercel alias/custom domain.
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (siteUrl) return `${siteUrl}/api`;

  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured && !configured.includes('localhost')) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return 'http://localhost:5000/api';
}
