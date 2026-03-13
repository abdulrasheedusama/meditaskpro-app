import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const DEFAULT_APP_ID = '1:924133081364:android:d779abf90e3252f120c201';

const artifactPath = process.argv[2];

if (!artifactPath) {
  console.error(
    'Usage: npm run distribute:firebase -- <path-to-apk-or-aab> [--groups qa-team] [--testers user@example.com]'
  );
  process.exit(1);
}

if (!existsSync(artifactPath)) {
  console.error(`Build artifact not found: ${artifactPath}`);
  process.exit(1);
}

const appId = process.env.FIREBASE_APP_ID || DEFAULT_APP_ID;
const extraArgs = process.argv.slice(3);

const result = spawnSync(
  'npx',
  ['firebase-tools', 'appdistribution:distribute', artifactPath, '--app', appId, ...extraArgs],
  {
    stdio: 'inherit',
    shell: true,
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
