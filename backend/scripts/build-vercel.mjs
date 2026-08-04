import { execSync } from 'node:child_process';
import { build } from 'esbuild';

execSync('npx prisma generate', { stdio: 'inherit' });

if (process.env.DATABASE_URL) {
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  } catch (error) {
    console.warn('prisma db push skipped or failed:', error instanceof Error ? error.message : error);
  }
}

await build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/app.js',
  format: 'cjs',
  packages: 'external',
  logLevel: 'info',
});

console.log('Backend bundle written to dist/app.js');
