import { create } from 'create-fumadocs-app';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

await create({
  outputDir: join(root, 'apps', 'docs'),
  template: '+next+fuma-docs-mdx',
  packageManager: 'pnpm',
  installDeps: true,
  initializeGit: false,
  log: (msg) => console.log(msg),
});
