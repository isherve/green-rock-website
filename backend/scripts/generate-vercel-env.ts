import { randomBytes } from 'node:crypto';

const jwtSecret = randomBytes(32).toString('hex');
const jwtRefresh = randomBytes(32).toString('hex');
const setupSecret = randomBytes(24).toString('hex');

console.log('Paste into Vercel → Settings → Environment Variables:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefresh}`);
console.log(`SETUP_SECRET=${setupSecret}`);
console.log('ADMIN_EMAIL=ishimwehervin10@gmail.com');
console.log('ADMIN_PASSWORD=Admin@123456');
console.log('FRONTEND_URL=https://YOUR-PROJECT.vercel.app');
console.log('NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app');
console.log('\nAfter deploy, seed production DB:');
console.log(`curl -X POST https://YOUR-PROJECT.vercel.app/api/setup/seed -H "x-setup-secret: ${setupSecret}"`);
