'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const vm = require('vm');

const OUT = path.join(__dirname, '..', 'fish');
const QUERIES = [
  ['minnow', 'Pseudorasbora parva fish'],
  ['crucian', 'Carassius carassius fish'],
  ['shrimp', 'Macrobrachium nipponense'],
  ['loach', 'Misgurnus anguillicaudatus'],
  ['bitter', 'Rhodeus ocellatus'],
  ['tilapia', 'Oreochromis niloticus'],
  ['snail', 'Cipangopaludina chinensis'],
  ['bream', 'Megalobrama amblycephala'],
  ['yellow', 'Tachysurus fulvidraco'],
  ['catfish', 'Silurus asotus'],
  ['carp', 'Cyprinus carpio'],
  ['grass', 'Ctenopharyngodon idella'],
  ['silver', 'Hypophthalmichthys molitrix'],
  ['goldfish', 'goldfish Carassius auratus'],
  ['gui', 'Siniperca chuatsi'],
  ['snake', 'Channa argus'],
  ['koi', 'koi Cyprinus'],
  ['golden', 'Ogon koi'],
  ['sardine', 'Sardinops sagax'],
  ['pomfret', 'Pampus argenteus'],
  ['hairtail', 'Trichiurus lepturus'],
  ['flounder', 'Paralichthys olivaceus'],
  ['crab', 'Portunus trituberculatus'],
  ['star', 'Asterias amurensis'],
  ['jelly', 'Aurelia aurita'],
  ['clown', 'Amphiprion ocellaris'],
  ['horse', 'Hippocampus comes'],
  ['dragon', 'Syngnathoides biaculeatus'],
  ['blind', 'Sinocyclocheilus fish'],
  ['cshrimp', 'Typhlatya'],
  ['bat', 'Platax orbicularis'],
  ['betta', 'Betta splendens'],
  ['skipper', 'Periophthalmus'],
  ['frog', 'Dryophytes japonicus'],
  ['guppy', 'Poecilia reticulata'],
  ['angel', 'Pterophyllum scalare'],
  ['oscar', 'Astronotus ocellatus'],
  ['pleco', 'Pterygoplichthys pardalis'],
  ['turtle', 'Mauremys reevesii'],
];

const agent = new https.Agent({ keepAlive: true, family: 6, maxSockets: 1 });

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      agent,
      timeout: 25000,
      headers: {
        'User-Agent': 'TableGame/1.0 (desktop pond album; personal use)',
        'Accept': '*/*',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        get(res.headers.location).then(resolve, reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.on('error', reject);
  });
}

function licenseOk(name) {
  const text = String(name || '').toLowerCase();
  if (!text) return false;
  if (text.includes('nc') || text.includes('noncommercial') || text.includes('non-commercial')) return false;
  return text.includes('cc0') || text.includes('public domain') || text.includes('cc by') || text === 'pd';
}

function extOf(mime, url) {
  if (String(mime).includes('png') || /\.png($|\?)/i.test(url)) return 'png';
  if (String(mime).includes('webp') || /\.webp($|\?)/i.test(url)) return 'webp';
  return 'jpg';
}

function rateLimited(res) {
  const head = res.body.slice(0, 24).toString('utf8');
  return res.status === 429 || head.startsWith('You are');
}

async function search(query, loose) {
  const prefix = loose ? '' : 'filetype:bitmap ';
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search'
    + '&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=520'
    + '&gsrsearch=' + encodeURIComponent(prefix + query);
  const res = await get(url);
  if (rateLimited(res)) {
    const error = new Error('rate');
    error.rate = true;
    throw error;
  }
  const data = JSON.parse(res.body.toString('utf8'));
  const pages = Object.values((data.query && data.query.pages) || {});
  const hits = [];
  pages.forEach((page) => {
    const info = page.imageinfo && page.imageinfo[0];
    if (!info) return;
    const mime = String(info.mime || '');
    if (!/^image\/(jpeg|png|webp|gif)/i.test(mime)) return;
    const meta = info.extmetadata || {};
    const license = (meta.LicenseShortName && meta.LicenseShortName.value) || '';
    if (!licenseOk(license)) return;
    const artist = String((meta.Artist && meta.Artist.value) || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const title = page.title || '';
    if (/paint|illustration|drawing|ukiyo|woodblock|artwork|sketch|stamp|icon|diagram|map|logo|sculpture|poster|print|kaidomaru|struggling|warrior|phylogen|distribution/i.test(title)) return;
    hits.push({
      title,
      thumb: info.thumburl || info.url,
      mime,
      license,
      artist: artist.slice(0, 80) || title.replace(/^File:/, ''),
    });
  });
  const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
  hits.sort((a, b) => {
    const rank = (hit) => (words.some((word) => hit.title.toLowerCase().includes(word)) ? 0 : 1);
    return rank(a) - rank(b);
  });
  return hits;
}

async function collectHits(query) {
  const strict = await search(query, false);
  if (strict.length) return strict;
  return search(query, true);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadExtraQueries() {
  const extraPath = path.join(__dirname, '..', 'extrafish.js');
  if (!fs.existsSync(extraPath)) return;
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(extraPath, 'utf8'), sandbox);
  (sandbox.EXTRA_FISH || []).forEach((fish) => {
    if (fish.sci && !QUERIES.some((row) => row[0] === fish.id)) QUERIES.push([fish.id, fish.sci]);
  });
}

function saveCredits(existing, credits) {
  const body = 'const FISH_PHOTO = ' + JSON.stringify(credits, null, 2) + ';\nwindow.FISH_PHOTO = FISH_PHOTO;\n';
  fs.writeFileSync(existing, body);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  loadExtraQueries();
  let credits = {};
  const existing = path.join(__dirname, '..', 'fishphotos.js');
  if (fs.existsSync(existing)) {
    const raw = fs.readFileSync(existing, 'utf8')
      .replace(/window\.FISH_PHOTO\s*=\s*FISH_PHOTO\s*;?\s*$/, '')
      .replace(/^const FISH_PHOTO = /, '')
      .replace(/;\s*$/, '');
    try { credits = JSON.parse(raw); } catch (error) { credits = {}; }
  }
  if (!credits.carp || !credits.carp.src) {
    console.log('REFUSE catalog missing carp');
    return;
  }
  const todo = QUERIES.filter(([id]) => !credits[id]);
  console.log('todo', todo.length, 'have', Object.keys(credits).length);
  for (const [id, query] of todo) {
    let done = false;
    let pause = 4000;
    for (let attempt = 1; attempt <= 6 && !done; attempt++) {
      await sleep(pause);
      pause = 8000;
      try {
        const hits = await collectHits(query);
        if (!hits.length) {
          console.log('MISS', id, query);
          done = true;
          break;
        }
        let got = false;
        for (const hit of hits.slice(0, 4)) {
          const file = await get(hit.thumb);
          if (rateLimited(file)) {
            pause = 75000;
            console.log('RATE wait', id, attempt);
            break;
          }
          if (file.status !== 200 || file.body.length < 800) continue;
          const ext = extOf(hit.mime, hit.thumb);
          const name = `${id}.${ext}`;
          fs.writeFileSync(path.join(OUT, name), file.body);
          credits[id] = { src: `fish/${name}`, credit: `${hit.artist || hit.title} · ${hit.license} · 维基共享资源` };
          saveCredits(existing, credits);
          console.log('OK', id, hit.license, hit.title);
          got = true;
          done = true;
          break;
        }
        if (!got && pause !== 75000) {
          console.log('BAD', id, query);
          done = true;
        }
      } catch (error) {
        if (error.rate) {
          pause = 75000;
          console.log('RATE wait', id, attempt);
          continue;
        }
        console.log('ERR', id, attempt, error.message);
      }
    }
  }
  saveCredits(existing, credits);
  console.log('saved', Object.keys(credits).length);
}

main();
