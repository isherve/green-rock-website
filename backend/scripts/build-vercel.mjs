import { execSync } from 'node:child_process';
import { build } from 'esbuild';

execSync('npx prisma generate', { stdio: 'inherit' });

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
