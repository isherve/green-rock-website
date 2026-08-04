import { execSync } from 'node:child_process';

execSync('npx prisma generate', { stdio: 'inherit' });

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL set — syncing schema...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
} else {
  console.warn('DATABASE_URL not set — skipping prisma db push (add Postgres before production deploy).');
}
