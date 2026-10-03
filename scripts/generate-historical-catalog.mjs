/**
 * Historical catalog generator entrypoint.
 * The authored base scenarios still live as 4-beat modules; expansion to 10 beats
 * is performed by scripts/expand-to-ten-beats.mjs (keeps beats 1–4, appends 5–10).
 *
 * Run: node scripts/generate-historical-catalog.mjs
 *   → delegates to expand-to-ten-beats.mjs
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const expand = path.join(__dirname, 'expand-to-ten-beats.mjs');
const result = spawnSync(process.execPath, [expand], { stdio: 'inherit' });
process.exit(result.status ?? 1);
