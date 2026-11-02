import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const salesOrigin = 'https://wifidigitalsystem.com';
const funnelOrigin = salesOrigin;
const salesPlayer = 'https://scripts.converteai.net/e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b/players/6add4403185f78840fdff033/v4/player.js';
const routes = [
  ['oto1', funnelOrigin], ['oto2', funnelOrigin], ['oto3', funnelOrigin],
  ['oto4', funnelOrigin], ['oto5', funnelOrigin], ['oto6', funnelOrigin],
  ['oto7', funnelOrigin], ['thankyou', funnelOrigin],
  ['terms', salesOrigin], ['pp', salesOrigin], ['refund', salesOrigin],
  ['compliance', salesOrigin], ['earnings', salesOrigin]
];

async function fetchPage(route, origin) {
  const response = await fetch(`${origin}/${route}`, {
    headers: { 'user-agent': 'Mozilla/5.0 DigitalWifi authorized mirror' }
  });
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  let html = await response.text();

  // This helper is the only same-origin relative asset in the hosted output.
  html = html.replaceAll(
    'src="/cdn-cgi/',
    `src="${origin}/cdn-cgi/`
  );

  const folder = join(process.cwd(), route);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html, 'utf8');
  return { route, bytes: Buffer.byteLength(html) };
}

const results = [];
for (const [route, origin] of routes) results.push(await fetchPage(route, origin));

// Make the primary offer available at both / and /vsl-e.
const primaryResponse = await fetch(`${salesOrigin}/vsl-e?affid=digitaltrilogy`, { headers: { 'user-agent': 'Mozilla/5.0 DigitalWifi authorized mirror' } });
if (!primaryResponse.ok) throw new Error(`vsl-e: HTTP ${primaryResponse.status}`);
const primary = (await primaryResponse.text()).replaceAll('src="/cdn-cgi/', `src="${salesOrigin}/cdn-cgi/`);
await mkdir(join(process.cwd(), 'vsl-e'), { recursive: true });
await writeFile(join(process.cwd(), 'index.html'), primary, 'utf8');
await writeFile(join(process.cwd(), 'vsl-e', 'index.html'), primary, 'utf8');
const playerResponse = await fetch(salesPlayer, { headers: { 'user-agent': 'Mozilla/5.0 DigitalWifi authorized mirror' } });
if (!playerResponse.ok) throw new Error(`sales player: HTTP ${playerResponse.status}`);
const player = (await playerResponse.text()).replaceAll('https://explodely.com/p/28198935?cid=30off', '/checkout?product=front');
await writeFile(join(process.cwd(), 'public', 'vturb-player.js'), player, 'utf8');
await writeFile(
  join(process.cwd(), 'mirror-manifest.json'),
  JSON.stringify({ salesSource: `${salesOrigin}/vsl-e`, funnelSource: funnelOrigin, generatedAt: new Date().toISOString(), pages: results }, null, 2),
  'utf8'
);

console.table(results);
