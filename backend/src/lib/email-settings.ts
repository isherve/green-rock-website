import prisma from './prisma';

const RESEND_KEY_SETTING = 'email.resendApiKey';
const CACHE_TTL_MS = 30_000;

let cachedResendKey: string | null | undefined;
let cacheExpiresAt = 0;

export function clearEmailSettingsCache(): void {
  cachedResendKey = undefined;
  cacheExpiresAt = 0;
}

export async function getResendApiKey(): Promise<string | null> {
  const envKey = process.env.RESEND_API_KEY?.trim();
  if (envKey) return envKey;

  if (cachedResendKey !== undefined && Date.now() < cacheExpiresAt) {
    return cachedResendKey;
  }

  try {
    const setting = await prisma.settings.findUnique({ where: { key: RESEND_KEY_SETTING } });
    const value = setting?.value;
    const dbKey = typeof value === 'string' && value.trim().startsWith('re_') ? value.trim() : null;
    cachedResendKey = dbKey;
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
    return dbKey;
  } catch {
    return null;
  }
}

export async function saveResendApiKey(apiKey: string): Promise<void> {
  await prisma.settings.upsert({
    where: { key: RESEND_KEY_SETTING },
    update: { value: apiKey.trim() },
    create: { key: RESEND_KEY_SETTING, value: apiKey.trim() },
  });
  clearEmailSettingsCache();
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}
