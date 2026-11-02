'use strict';

const FARM_CROPS = [
  { id: 'parsnip', name: '防风草', season: 'spring', price: 15, sell: 40, days: 1, fruit: '#f4e2b0', leaf: '#6aaa38' },
  { id: 'potato', name: '土豆', season: 'spring', price: 25, sell: 80, days: 1, fruit: '#e0c070', leaf: '#4a8a30' },
  { id: 'cauliflower', name: '花椰菜', season: 'spring', price: 40, sell: 150, days: 2, fruit: '#f4f4e8', leaf: '#3d8a32' },
  { id: 'strawberry', name: '草莓', season: 'spring', price: 50, sell: 160, days: 2, fruit: '#d04545', leaf: '#3a7a28' },
  { id: 'tomato', name: '番茄', season: 'summer', price: 30, sell: 90, days: 1, fruit: '#e05038', leaf: '#4a9a30' },
  { id: 'blueberry', name: '蓝莓', season: 'summer', price: 40, sell: 130, days: 2, fruit: '#4060c0', leaf: '#2f6a38' },
  { id: 'sunflower', name: '向日葵', season: 'summer', price: 20, sell: 70, days: 1, fruit: '#f0c040', leaf: '#5a9830' },
  { id: 'pumpkin', name: '南瓜', season: 'fall', price: 50, sell: 180, days: 2, fruit: '#e88830', leaf: '#3a7030' },
  { id: 'eggplant', name: '茄子', season: 'fall', price: 30, sell: 100, days: 1, fruit: '#6a4088', leaf: '#3a7830' },
  { id: 'radish', name: '萝卜', season: 'winter', price: 20, sell: 60, days: 1, fruit: '#f4f4f8', leaf: '#4a8840' },
  { id: 'bok', name: '青菜', season: 'winter', price: 15, sell: 50, days: 1, fruit: '#7ad050', leaf: '#3a8a28' },
];

const SEASON_NAME = { spring: '春', summer: '夏', fall: '秋', winter: '冬' };
const SEASON_GRASS = { spring: '#67a83a', summer: '#4e9a32', fall: '#8aaa40', winter: '#c5d4c8' };
const SEASON_SOIL = { spring: '#8a5a32', summer: '#7a4e2c', fall: '#6e442c', winter: '#5a4838' };

function farmSeason(date) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

function farmStamp(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

const FARM_W = 16;
const FARM_H = 12;
const TILL_X0 = 2;
const TILL_Y0 = 2;
const TILL_X1 = 13;
const TILL_Y1 = 9;
const ZOOMS = [16, 24, 32, 48];
const RIPE_MS = 40 * 60 * 1000;

function blankPlots() {
  return Array.from({ length: FARM_W * FARM_H }, () => ({ tilled: false, crop: '', stage: 0, wateredOn: 0, wateredAt: 0, grownOn: 0 }));
}

function inField(col, row) {
  return col >= TILL_X0 && col <= TILL_X1 && row >= TILL_Y0 && row <= TILL_Y1;
}

function mergePlot(src) {
  const crop = cropById(src && src.crop) ? src.crop : '';
  return {
    tilled: !!(src && src.tilled) || !!crop,
    crop,
    stage: Math.max(0, Number(src && src.stage) || 0),
    wateredOn: Number(src && src.wateredOn) || 0,
    wateredAt: Number(src && src.wateredAt) > 1e11 ? Number(src.wateredAt) : 0,
    grownOn: Number(src && src.grownOn) || 0,
  };
}

function plotsFromSave(incoming) {
  const plots = blankPlots();
  if (!Array.isArray(incoming) || !incoming.length) return plots;
  if (incoming.length === plots.length) {
    incoming.forEach((src, index) => { plots[index] = mergePlot(src); });
    return plots;
  }
  if (incoming.length === 9) {
    incoming.forEach((src, index) => {
      const col = 6 + (index % 3);
      const row = 4 + Math.floor(index / 3);
      plots[row * FARM_W + col] = mergePlot(src);
    });
    return plots;
  }
  incoming.forEach((src, index) => {
    if (index < plots.length) plots[index] = mergePlot(src);
  });
  return plots;
}

function cropById(id) {
  return FARM_CROPS.find((crop) => crop.id === id) || null;
}

function soilWet(plot, today) {
  const crop = cropById(plot.crop);
  if (crop && plot.wateredAt && plot.stage < crop.days) return true;
  return plot.wateredOn === today;
}

function waitText(ms) {
  const minutes = Math.ceil(ms / 60000);
  if (minutes <= 1) return '不到一分钟';
  return `大约 ${minutes} 分钟`;
}

function starterSeeds() {
  const season = farmSeason(new Date());
  const crop = FARM_CROPS.filter((item) => item.season === season).sort((a, b) => a.price - b.price)[0];
  return { [crop.id]: 4 };
}

const Farm = {
  gold: 400,
  seeds: {},
  bought: {},
  plots: blankPlots(),
  harvested: {},
  barn: {},
  tool: 'hoe',
  seedId: 'parsnip',
  zoom: 32,
  camX: 7.5,
  camY: 5.5,

  load(data) {
    if (!data || typeof data !== 'object' || data.farm) {
      const pack = data && data.farm && typeof data.farm === 'object' ? data.farm : null;
      if (pack && (Array.isArray(pack.plots) || pack.seeds || pack.gold != null)) {
        this.load(pack);
        return;
      }
      this.gold = 400;
      this.seeds = starterSeeds();
      this.bought = {};
      this.seedId = Object.keys(this.seeds)[0];
      this.plots = blankPlots();
      this.harvested = {};
      this.barn = {};
    } else {
      this.gold = Math.max(0, Number(data.gold) || 0);
      this.seeds = {};
      this.bought = {};
      FARM_CROPS.forEach((crop) => {
        const n = Number(data.seeds && data.seeds[crop.id]) || 0;
        if (n > 0) this.seeds[crop.id] = n;
        const day = Number(data.bought && data.bought[crop.id]) || 0;
        if (day > 0) this.bought[crop.id] = day;
      });
      this.plots = plotsFromSave(Array.isArray(data.plots) ? data.plots : []);
      if (data.view && ZOOMS.includes(Number(data.view.zoom))) this.zoom = Number(data.view.zoom);
      if (data.view && Number.isFinite(Number(data.view.x))) this.camX = Number(data.view.x);
      if (data.view && Number.isFinite(Number(data.view.y))) this.camY = Number(data.view.y);
      this.harvested = {};
      this.barn = {};
      if (data.barn && typeof data.barn === 'object') {
        FARM_CROPS.forEach((crop) => {
          const n = Number(data.barn[crop.id]) || 0;
          if (n > 0) this.barn[crop.id] = n;
        });
      }
      if (data.harvested && typeof data.harvested === 'object') {
        FARM_CROPS.forEach((crop) => {
          const n = Number(data.harvested[crop.id]) || 0;
          if (n > 0) this.harvested[crop.id] = n;
        });
      }
    }
    this.catchUp();
    this.fixStarter();
    this.paint();
  },

  payload() {
    return {
      gold: this.gold,
      seeds: { ...this.seeds },
      bought: { ...this.bought },
      plots: this.plots.map((plot) => ({ ...plot })),
      harvested: { ...this.harvested },
      barn: { ...this.barn },
      view: { zoom: this.zoom, x: this.camX, y: this.camY },
    };
  },

  zoomBy(dir) {
    const index = Math.max(0, ZOOMS.indexOf(this.zoom));
    const next = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, index + dir))];
    if (next === this.zoom) return;
    this.zoom = next;
    this.paintMap();
    setHint(dir > 0 ? '地图放大了。' : '地图缩小了，能看见更多田。');
    if (typeof queueSave === 'function') queueSave();
  },

  pan(dx, dy) {
    this.camX = Math.max(0.5, Math.min(FARM_W - 0.5, this.camX + dx));
    this.camY = Math.max(0.5, Math.min(FARM_H - 0.5, this.camY + dy));
    this.paintMap();
    if (typeof queueSave === 'function') queueSave();
  },

  paintGold() {
    const text = `${this.gold} 金`;
    const farmGold = document.getElementById('farm-gold');
    const purse = document.getElementById('purse');
    if (farmGold) farmGold.textContent = text;
    if (purse) purse.textContent = text;
  },

  gain(amount) {
    this.gold += Math.max(0, Math.floor(amount) || 0);
    this.paintGold();
  },

  trySpend(amount) {
    const cost = Math.floor(amount) || 0;
    if (this.gold < cost) return false;
    this.gold -= cost;
    this.paintGold();
    return true;
  },

  fixStarter() {
    const planted = this.plots.some((plot) => plot.crop);
    const kept = Object.values(this.harvested).some((count) => count > 0);
    if (planted || kept) return;
    const season = farmSeason(new Date());
    const ids = Object.keys(this.seeds).filter((id) => this.seeds[id] > 0);
    const usable = ids.some((id) => {
      const crop = cropById(id);
      return crop && crop.season === season;
    });
    if (usable) return;
    this.seeds = starterSeeds();
    this.bought = {};
    this.seedId = Object.keys(this.seeds)[0];
  },

  catchUp() {
    const now = Date.now();
    const today = farmStamp(new Date());
    let changed = false;
    this.plots.forEach((plot) => {
      const crop = cropById(plot.crop);
      if (!crop || plot.stage >= crop.days) return;
      if (!plot.wateredAt && plot.wateredOn && plot.wateredOn < 1e8 && plot.wateredOn < today && plot.grownOn !== today) {
        plot.stage += 1;
        plot.wateredOn = 0;
        plot.grownOn = today;
        changed = true;
        return;
      }
      if (!plot.wateredAt && plot.wateredOn === today) {
        plot.wateredAt = now;
        changed = true;
      }
      if (!plot.wateredAt) return;
      const step = RIPE_MS / crop.days;
      const next = Math.min(crop.days, Math.floor((now - plot.wateredAt) / step));
      if (next > plot.stage) {
        plot.stage = next;
        changed = true;
      }
    });
    return changed;
  },

  paintMap() {
    const canvas = document.getElementById('farm');
    if (!canvas) return;
    const frame = canvas.parentElement;
    const w = Math.max(160, Math.floor(frame.clientWidth || 280));
    const h = Math.max(140, Math.floor(frame.clientHeight || 180));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    const season = farmSeason(new Date());
    const today = farmStamp(new Date());
    const z = this.zoom;
    ctx.imageSmoothingEnabled = false;
    const sky = season === 'winter' ? '#d7e8f0' : '#e6b44e';
    if (frame) frame.style.background = sky;
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const left = this.camX - w / (2 * z);
    const top = this.camY - h / (2 * z);
    const c0 = Math.max(0, Math.floor(left));
    const r0 = Math.max(0, Math.floor(top));
    const c1 = Math.min(FARM_W - 1, Math.floor(left + w / z) + 1);
    const r1 = Math.min(FARM_H - 1, Math.floor(top + h / z) + 1);
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const sx = Math.round((col - left) * z);
        const sy = Math.round((row - top) * z);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(z / TILE, z / TILE);
        if (inField(col, row)) drawPlot(ctx, this.plots[row * FARM_W + col], season, today, col, row);
        else tileGround(ctx, season, col, row);
        ctx.restore();
      }
    }
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const sx = Math.round((col - left) * z);
        const sy = Math.round((row - top) * z);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(z / TILE, z / TILE);
        if (!inField(col, row) && !onFenceRing(col, row)) drawProp(ctx, col, row, season);
        ctx.restore();
      }
    }
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        if (!onFenceRing(col, row)) continue;
        const sx = Math.round((col - left) * z);
        const sy = Math.round((row - top) * z);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(z / TILE, z / TILE);
        drawFence(ctx, col, row, season);
        ctx.restore();
      }
    }
    const standCol = Math.floor(this.camX);
    const standRow = Math.floor(this.camY);
    const hx = Math.round((standCol - left) * z);
    const hy = Math.round((standRow - top) * z);
    ctx.fillStyle = '#f0d060';
    ctx.fillRect(hx, hy, z, 2);
    ctx.fillRect(hx, hy + z - 2, z, 2);
    ctx.fillRect(hx, hy, 2, z);
    ctx.fillRect(hx + z - 2, hy, 2, z);
    ctx.save();
    ctx.translate(hx, hy);
    ctx.scale(z / TILE, z / TILE);
    drawFarmer(ctx);
    ctx.restore();
  },

  useHere() {
    const col = Math.floor(this.camX);
    const row = Math.floor(this.camY);
    if (col < 0 || row < 0 || col >= FARM_W || row >= FARM_H) return;
    usePlot(row * FARM_W + col);
  },

  paint() {
    this.paintMap();
    this.paintGold();
    renderPack();
    const season = farmSeason(new Date());
    const seasonEl = document.getElementById('farm-season');
    const nowCrops = FARM_CROPS.filter((crop) => crop.season === season).map((crop) => crop.name).join('、');
    if (seasonEl) seasonEl.textContent = `${SEASON_NAME[season]}季 · ${nowCrops}`;
  },

  pickTool(name) {
    this.tool = name;
    markTool(name);
    const lines = {
      hoe: '锄头。空格翻脚下，R 翻开整块田里的空地。',
      water: '水壶。空格浇脚下，R 浇整块田。',
      harvest: '收获。空格收脚下，R 把熟了的都收进背包。',
      shovel: '铲子。空格铲脚下这一格，不会一下铲完整块田。',
    };
    setHint(lines[name] || '');
  },

  cycleSeed(dir) {
    const ids = FARM_CROPS.map((crop) => crop.id).filter((id) => this.seeds[id] > 0);
    if (!ids.length) {
      setHint('背包里没有种子。按 B 去买，数量可以自己填。');
      return;
    }
    let index = ids.indexOf(this.seedId);
    index = index < 0 ? 0 : (index + dir + ids.length) % ids.length;
    this.seedId = ids[index];
    this.tool = 'seed';
    markTool('seed');
    const crop = cropById(this.seedId);
    setHint(`拿出${crop.name}，还剩 ${this.seeds[this.seedId]}。空格种脚下，R 种整块空地。`);
  },

  useField() {
    if (this.tool === 'shovel') {
      setHint('铲子一次只动脚下这一格。空格来铲。');
      return;
    }
    let n = 0;
    let name = '';
    for (let row = TILL_Y0; row <= TILL_Y1; row++) {
      for (let col = TILL_X0; col <= TILL_X1; col++) {
        const result = applyTool(row * FARM_W + col);
        if (result.ok) {
          n += 1;
          name = result.name || name;
        }
      }
    }
    if (!n) {
      const empty = {
        hoe: '没有还能翻的空地。',
        water: '没有还没浇的地。',
        harvest: '没有熟了的菜。',
        seed: '没有能种的空土，或种子用完了。',
      };
      setHint(empty[this.tool] || '没有可做的。');
    } else if (this.tool === 'seed') setHint(`整块田种下 ${n} 颗${name}。`);
    else if (this.tool === 'harvest') setHint(`收进背包 ${n} 个。`);
    else if (this.tool === 'water') setHint(`浇了 ${n} 块。`);
    else setHint(`翻开了 ${n} 块。`);
    this.paint();
    if (typeof queueSave === 'function') queueSave();
  },

  togglePack() {
    const box = document.getElementById('pack');
    const widget = document.getElementById('widget');
    if (!box || (widget && widget.classList.contains('compact'))) return;
    box.hidden = !box.hidden;
    if (!box.hidden) renderPack();
  },
};

const TILE = 48;
const PX = 3;

function pix(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PX, y * PX, w * PX, h * PX);
}

function cellHash(col, row, n) {
  return Math.abs((col * 47 + row * 83 + n * 19) % 97);
}

function plotAt(col, row) {
  if (col < 0 || row < 0 || col >= FARM_W || row >= FARM_H) return null;
  return Farm.plots[row * FARM_W + col];
}

function tilledAt(col, row) {
  const plot = plotAt(col, row);
  return !!(plot && inField(col, row) && (plot.tilled || plot.crop));
}

function bedIsolated(col, row) {
  return !tilledAt(col - 1, row) && !tilledAt(col + 1, row) && !tilledAt(col, row - 1) && !tilledAt(col, row + 1);
}

function onFenceRing(col, row) {
  if (inField(col, row)) return false;
  return col >= TILL_X0 - 1 && col <= TILL_X1 + 1 && row >= TILL_Y0 - 1 && row <= TILL_Y1 + 1;
}

function propKind(col, row) {
  if (col === FARM_W - 1) return 'path';
  const table = {
    '0,0': 'round', '1,0': 'grass', '2,0': 'pine', '3,0': 'grass', '4,0': 'rock',
    '5,0': 'grass', '6,0': 'shed', '7,0': '', '8,0': 'grass', '9,0': 'round',
    '10,0': 'grass', '11,0': 'pine', '12,0': 'bush', '13,0': 'grass', '14,0': 'round',
    '0,11': 'pine', '1,11': 'grass', '2,11': 'round', '3,11': 'grass', '4,11': 'log',
    '5,11': 'grass', '6,11': 'bush', '7,11': 'grass', '8,11': 'pine', '9,11': 'grass',
    '10,11': 'rock', '11,11': 'grass', '12,11': 'round', '13,11': 'bush', '14,11': 'grass',
    '0,1': 'grass', '0,2': 'round', '0,3': 'grass', '0,4': 'pine', '0,5': 'bush',
    '0,6': 'grass', '0,7': 'rock', '0,8': 'round', '0,9': 'grass', '0,10': 'bush',
  };
  return table[`${col},${row}`] || '';
}

function tileGround(ctx, season, col, row) {
  const winter = season === 'winter';
  const base = winter ? '#e7f3f8' : '#e6b44e';
  pix(ctx, 0, 0, 16, 16, base);
  const lite = winter ? '#f7fbfe' : '#f3d078';
  const dark = winter ? '#c5dcea' : '#c99234';
  for (let i = 0; i < 8; i++) {
    const x = cellHash(col, row, i) % 15;
    const y = cellHash(col, row, i + 4) % 15;
    pix(ctx, x, y, 1, 1, i % 2 ? lite : dark);
  }
  if (!winter && cellHash(col, row, 9) % 3 === 0) pix(ctx, 2 + (cellHash(col, row, 8) % 10), 12, 2, 1, '#b89060');
  if (season === 'spring' && cellHash(col, row, 6) % 2 === 0) pix(ctx, 4 + (cellHash(col, row, 7) % 8), 6, 1, 1, '#f4b0c8');
  if (season === 'fall' && cellHash(col, row, 6) % 2 === 0) pix(ctx, 5 + (cellHash(col, row, 7) % 8), 5, 1, 1, '#e07040');
  if (winter && cellHash(col, row, 3) % 2 === 0) pix(ctx, 3, 8, 6, 3, '#d4e8f2');
}

function drawSandBits(ctx, col, row, season) {
  if (season === 'winter') return;
  if (cellHash(col, row, 5) % 3 === 0) grassTuft(ctx, 11, 14, season);
}

function drawRoundPlot(ctx, wet) {
  const rim = wet ? '#4a301c' : '#6a4024';
  const mid = wet ? '#5c3c28' : '#b06a38';
  const hi = wet ? '#7a5840' : '#e0a060';
  const bands = [[3, 10], [2, 12], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [2, 12], [3, 10]];
  bands.forEach(([x, w], i) => {
    pix(ctx, x, 2 + i, w, 1, rim);
    if (w > 4) pix(ctx, x + 1, 2 + i, w - 2, 1, mid);
  });
  pix(ctx, 5, 5, 3, 2, hi);
  pix(ctx, 6, 8, 1, 1, wet ? '#3a2818' : '#7a4a28');
  pix(ctx, 9, 10, 1, 1, wet ? '#3a2818' : '#7a4a28');
  pix(ctx, 7, 12, 1, 1, wet ? '#3a2818' : '#8a5830');
}

function drawBed(ctx, col, row, wet) {
  const base = wet ? '#6a4128' : '#a86838';
  const hole = wet ? '#3e2818' : '#7a4a28';
  const hi = wet ? '#8a5840' : '#c48448';
  const rim = '#4e301c';
  pix(ctx, 0, 0, 16, 16, base);
  if (!tilledAt(col, row - 1)) pix(ctx, 0, 0, 16, 1, rim);
  if (!tilledAt(col, row + 1)) pix(ctx, 0, 15, 16, 1, rim);
  if (!tilledAt(col - 1, row)) pix(ctx, 0, 0, 1, 16, rim);
  if (!tilledAt(col + 1, row)) pix(ctx, 15, 0, 1, 16, rim);
  for (let i = 0; i < 10; i++) {
    const x = 1 + cellHash(col, row, i) % 14;
    const y = 1 + cellHash(col, row, i + 3) % 14;
    pix(ctx, x, y, 1, 1, i % 3 === 0 ? hi : hole);
  }
}

function drawSoil(ctx, col, row, wet) {
  if (bedIsolated(col, row)) drawRoundPlot(ctx, wet);
  else drawBed(ctx, col, row, wet);
}

function drawPlot(ctx, plot, season, today, col, row) {
  tileGround(ctx, season, col, row);
  if (!plot.tilled && !plot.crop) {
    drawSandBits(ctx, col, row, season);
    return;
  }
  drawSoil(ctx, col, row, soilWet(plot, today));
  drawCrop(ctx, plot, col, row, today);
}

function sprout(ctx, x, y, leaf) {
  pix(ctx, x, y, 1, 2, '#1e4814');
  pix(ctx, x - 1, y - 2, 2, 2, leaf);
  pix(ctx, x + 1, y - 2, 2, 2, '#d2f090');
  pix(ctx, x, y - 3, 1, 1, '#f4ffe0');
}

function drawSprinkler(ctx) {
  pix(ctx, 7, 6, 2, 1, '#b0b6ba');
  pix(ctx, 5, 7, 6, 1, '#6a7078');
  pix(ctx, 7, 8, 2, 3, '#8a9094');
  pix(ctx, 4, 9, 8, 1, '#5a6068');
  pix(ctx, 7, 7, 1, 1, '#f4f7f8');
}

function stake(ctx, x, leaf, fruit, showFruit) {
  pix(ctx, x, 1, 1, 14, '#5a3820');
  pix(ctx, x, 1, 1, 2, '#f0d8a8');
  pix(ctx, x - 2, 4, 5, 1, '#6a4428');
  pix(ctx, x - 1, 6, 1, 2, leaf);
  pix(ctx, x + 1, 8, 1, 2, '#3e7a28');
  pix(ctx, x - 1, 11, 2, 2, leaf);
  if (showFruit) {
    pix(ctx, x + 1, 5, 2, 2, fruit);
    pix(ctx, x - 2, 9, 2, 2, fruit);
  }
}

function drawCrop(ctx, plot, col, row, today) {
  const crop = cropById(plot.crop);
  const wet = soilWet(plot, today);
  const isolated = bedIsolated(col, row);
  if (!crop) {
    if (wet && isolated) drawSprinkler(ctx);
    return;
  }
  const vine = crop.id === 'tomato' || crop.id === 'blueberry' || crop.id === 'strawberry';
  if (plot.stage < crop.days) {
    if (vine) {
      stake(ctx, 4, crop.leaf, crop.fruit, plot.stage >= 1);
      stake(ctx, 11, crop.leaf, crop.fruit, plot.stage >= 1);
    } else if (isolated) {
      [[5, 3], [10, 3], [2, 8], [13, 8], [5, 13], [10, 13]].forEach(([x, y]) => sprout(ctx, x, y, crop.leaf));
      if (wet) drawSprinkler(ctx);
    } else if (plot.stage >= 1) {
      sprout(ctx, 4, 12, crop.leaf);
      sprout(ctx, 8, 9, crop.leaf);
      sprout(ctx, 12, 12, crop.leaf);
      pix(ctx, 6, 7, 4, 2, crop.leaf);
    } else {
      [[3, 12], [8, 10], [12, 12]].forEach(([x, y]) => sprout(ctx, x, y, crop.leaf));
    }
    return;
  }
  ctx.save();
  drawMature(ctx, crop.id);
  ctx.restore();
}

function drawFruitBush(ctx, fruit, leaf) {
  [[1, 9], [6, 7], [11, 9]].forEach(([x, y], i) => {
    pix(ctx, x, y, 4, 6, '#1e4c16');
    pix(ctx, x, y - 2, 4, 3, i === 1 ? '#6aaa40' : leaf);
    pix(ctx, x + 1, y - 3, 2, 2, '#c6e878');
    pix(ctx, x + 1, y + 1, 2, 2, fruit);
    pix(ctx, x, y + 3, 2, 2, fruit);
  });
}

function drawMature(ctx, id) {
  if (id === 'tomato' || id === 'strawberry' || id === 'blueberry') {
    const fruit = id === 'blueberry' ? '#4060c8' : id === 'tomato' ? '#e04830' : '#d03848';
    drawFruitBush(ctx, fruit, '#2f7a28');
    return;
  }
  if (id === 'sunflower') {
    pix(ctx, 7, 8, 2, 7, '#3a7a28');
    pix(ctx, 4, 2, 8, 6, '#f0c040');
    pix(ctx, 5, 3, 6, 4, '#f8d868');
    pix(ctx, 6, 4, 4, 3, '#6a4018');
    pix(ctx, 3, 11, 3, 2, '#3e8a32');
    pix(ctx, 10, 12, 3, 2, '#2a681c');
    return;
  }
  if (id === 'pumpkin') {
    pix(ctx, 3, 7, 10, 7, '#e08020');
    pix(ctx, 4, 6, 8, 8, '#e88820');
    pix(ctx, 5, 6, 1, 8, '#f0a040');
    pix(ctx, 8, 6, 1, 8, '#c86810');
    pix(ctx, 11, 6, 1, 8, '#f0a040');
    pix(ctx, 7, 4, 2, 2, '#3a7a28');
    pix(ctx, 5, 5, 3, 2, '#2f6a28');
    return;
  }
  if (id === 'cauliflower') {
    pix(ctx, 2, 8, 3, 6, '#2f6a28');
    pix(ctx, 11, 8, 3, 6, '#3e8a32');
    pix(ctx, 4, 5, 8, 8, '#f4f4ea');
    pix(ctx, 5, 6, 3, 3, '#ffffff');
    pix(ctx, 8, 8, 3, 3, '#e0e0d4');
    return;
  }
  if (id === 'potato') {
    pix(ctx, 3, 4, 10, 3, '#3e8a32');
    pix(ctx, 4, 3, 4, 2, '#6aaa40');
    pix(ctx, 3, 8, 5, 4, '#c49848');
    pix(ctx, 8, 9, 5, 4, '#a07830');
    pix(ctx, 4, 9, 1, 1, '#5a3818');
    pix(ctx, 10, 11, 1, 1, '#5a3818');
    return;
  }
  if (id === 'eggplant') {
    pix(ctx, 4, 3, 8, 3, '#3e8a32');
    pix(ctx, 6, 5, 4, 9, '#6a3888');
    pix(ctx, 6, 6, 1, 6, '#8a58a8');
    pix(ctx, 7, 4, 3, 2, '#3a2048');
    return;
  }
  if (id === 'parsnip' || id === 'radish') {
    const body = id === 'radish' ? '#f4f0f4' : '#f3e2b0';
    const tip = id === 'radish' ? '#e07080' : '#d8c090';
    pix(ctx, 3, 4, 4, 3, '#3e8a32');
    pix(ctx, 9, 4, 4, 3, '#2a681c');
    pix(ctx, 6, 6, 4, 8, body);
    pix(ctx, 6, 6, 1, 7, '#f7f0d8');
    pix(ctx, 7, 12, 2, 2, tip);
    return;
  }
  pix(ctx, 3, 5, 4, 9, '#7ad050');
  pix(ctx, 7, 3, 3, 11, '#58b838');
  pix(ctx, 10, 5, 3, 9, '#3e9a30');
  pix(ctx, 4, 6, 1, 6, '#f4f4ea');
  pix(ctx, 8, 4, 1, 8, '#e8f0d0');
}

function drawFruit(ctx, id, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  drawMature(ctx, id);
  ctx.restore();
}

function buySeed(crop, count) {
  const season = farmSeason(new Date());
  const asked = Math.max(1, Math.min(999, Math.floor(Number(count) || 1)));
  if (crop.season !== season) {
    setHint(`${crop.name}要等${SEASON_NAME[crop.season]}季。`);
    return;
  }
  const afford = Math.floor(Farm.gold / crop.price);
  const buy = Math.min(asked, afford);
  if (buy <= 0) {
    setHint('金子不够。收一点再来。');
    return;
  }
  Farm.gold -= buy * crop.price;
  Farm.seeds[crop.id] = (Farm.seeds[crop.id] || 0) + buy;
  Farm.seedId = crop.id;
  Farm.tool = 'seed';
  markTool('seed');
  Farm.paintGold();
  const short = buy < asked ? `金子只够 ${buy} 包。` : '';
  setHint(`买下 ${buy} 包${crop.name}。${short}`);
  if (typeof queueSave === 'function') queueSave();
  renderPack();
}

function packSection(title) {
  const sec = document.createElement('section');
  sec.className = 'pack-sec';
  const head = document.createElement('h3');
  head.textContent = title;
  sec.append(head);
  return sec;
}

function packRow(parent, title, action, onClick) {
  const row = document.createElement('div');
  row.className = 'pack-row';
  const name = document.createElement('span');
  name.textContent = title;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = action;
  button.addEventListener('click', onClick);
  row.append(name, button);
  parent.append(row);
}

function packEmpty(parent, text) {
  const empty = document.createElement('div');
  empty.className = 'pack-empty';
  empty.textContent = text;
  parent.append(empty);
}

function renderPack() {
  const box = document.getElementById('pack');
  const body = document.getElementById('pack-body');
  if (!box || !body || box.hidden) return;
  body.replaceChildren();
  const season = farmSeason(new Date());

  const fish = packSection('鱼');
  const stock = (typeof Pond !== 'undefined' && Pond.album && Pond.album.stock) || {};
  const held = (typeof LOOT !== 'undefined' ? LOOT : []).filter((item) => stock[item.id] > 0);
  if (!held.length) packEmpty(fish, '鱼篓是空的。钓上来的会放在这里。');
  held.forEach((item) => {
    const price = Pond.price(item);
    packRow(fish, `${item.name} ×${stock[item.id]}`, `卖掉 · ${price}金`, () => {
      if (!Pond.sell(item.id)) return;
      setHint(`卖掉${item.name}，进账 ${price} 金。`);
      renderPack();
    });
  });

  const seeds = packSection('种子');
  const seedRows = FARM_CROPS.filter((crop) => crop.season === season || Farm.seeds[crop.id] > 0);
  if (!seedRows.length) packEmpty(seeds, '这个季节没有种子。');
  seedRows.forEach((crop) => {
    const owned = Farm.seeds[crop.id] || 0;
    const inSeason = crop.season === season;
    const row = document.createElement('div');
    row.className = 'pack-row';
    const name = document.createElement('span');
    name.textContent = `${crop.name} ×${owned} · ${crop.price}金`;
    row.append(name);
    if (inSeason) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '999';
      input.value = '10';
      input.className = 'pack-qty';
      input.setAttribute('aria-label', `${crop.name}购买数量`);
      const buy = document.createElement('button');
      buy.type = 'button';
      buy.textContent = '买';
      buy.addEventListener('click', () => buySeed(crop, input.value));
      row.append(input, buy);
    }
    if (owned > 0) {
      const take = document.createElement('button');
      take.type = 'button';
      take.textContent = Farm.seedId === crop.id && Farm.tool === 'seed' ? '已拿出' : '拿去种';
      take.addEventListener('click', () => {
        Farm.seedId = crop.id;
        Farm.tool = 'seed';
        markTool('seed');
        setHint(`拿出${crop.name}。空格种脚下，R 种整块空地。`);
        document.getElementById('pack').hidden = true;
      });
      row.append(take);
    } else if (!inSeason) {
      const wait = document.createElement('button');
      wait.type = 'button';
      wait.disabled = true;
      wait.textContent = '下季';
      row.append(wait);
    }
    seeds.append(row);
  });

  const crops = packSection('收成');
  const ids = FARM_CROPS.map((crop) => crop.id).filter((id) => Farm.barn[id] > 0);
  if (!ids.length) packEmpty(crops, '还没有收成。熟了按 3 或 R 收进来。');
  ids.forEach((id) => {
    const crop = cropById(id);
    packRow(crops, `${crop.name} ×${Farm.barn[id]}`, `卖掉 · ${crop.sell}金`, () => {
      if (!(Farm.barn[id] > 0)) return;
      Farm.barn[id] -= 1;
      if (Farm.barn[id] <= 0) delete Farm.barn[id];
      Farm.gain(crop.sell);
      setHint(`卖掉${crop.name}，进账 ${crop.sell} 金。`);
      renderPack();
      if (typeof queueSave === 'function') queueSave();
    });
  });

  body.append(fish, seeds, crops);
}

function markTool(name) {
  document.querySelectorAll('#farm-tools button').forEach((button) => {
    button.classList.toggle('on', button.dataset.tool === name);
  });
}

function setHint(text) {
  const hint = document.getElementById('farm-hint');
  if (hint) hint.textContent = text;
}

function grassTuft(ctx, x, y, season) {
  const a = season === 'fall' ? '#c47830' : season === 'winter' ? '#9ec4c8' : '#3e8a28';
  const b = season === 'fall' ? '#e0a040' : season === 'winter' ? '#e8f6fa' : '#8ed060';
  const c = season === 'fall' ? '#a85a28' : season === 'winter' ? '#7aa8b0' : '#245818';
  pix(ctx, x, y - 3, 1, 3, a);
  pix(ctx, x + 1, y - 4, 1, 4, b);
  pix(ctx, x + 2, y - 2, 1, 2, c);
  if (season === 'spring') pix(ctx, x + 1, y - 5, 1, 1, '#f4b0c8');
  if (season === 'summer') pix(ctx, x, y - 5, 1, 1, '#f4f0c0');
  if (season === 'fall') pix(ctx, x + 2, y - 3, 1, 1, '#f0d060');
}

function drawGrassPatch(ctx, season) {
  if (season === 'winter') {
    pix(ctx, 1, 7, 14, 8, '#6a9aab');
    pix(ctx, 2, 5, 12, 4, '#b7d6e0');
    pix(ctx, 4, 3, 8, 3, '#f4fbff');
    pix(ctx, 3, 8, 2, 2, '#e8f6fa');
    pix(ctx, 10, 6, 2, 2, '#ffffff');
    return;
  }
  const base = season === 'fall' ? '#7a6424' : '#2f7a2a';
  const dark = season === 'fall' ? '#5a4818' : '#1a5018';
  const lite = season === 'fall' ? '#d8a040' : '#9ee060';
  pix(ctx, 0, 4, 16, 12, base);
  for (let i = 0; i < 36; i++) {
    const x = (i * 7) % 16;
    const y = 5 + (i % 9);
    pix(ctx, x, y, 1, 3, i % 3 === 0 ? lite : dark);
  }
  const flower = season === 'fall' ? '#f0c050' : '#f4b0c8';
  [[2, 6], [6, 8], [11, 7], [4, 12], [9, 11], [13, 10], [8, 5]].forEach(([x, y], i) => {
    pix(ctx, x, y, 1, 1, i % 2 ? '#fff6ea' : flower);
  });
}

function drawRoundTree(ctx, season, col) {
  if (season === 'winter' && col % 2 === 0) {
    pix(ctx, 7, -2, 2, 18, '#8a5a3a');
    pix(ctx, 3, 0, 5, 1, '#8a5a3a');
    pix(ctx, 8, 2, 6, 1, '#a06a44');
    pix(ctx, 4, 5, 4, 1, '#8a5a3a');
    pix(ctx, 9, 8, 5, 1, '#a06a44');
    pix(ctx, 5, -4, 3, 2, '#6a4428');
    pix(ctx, 2, -1, 4, 1, '#f4fbff');
    pix(ctx, 9, 1, 3, 1, '#ffffff');
    return;
  }
  const sets = {
    spring: ['#1e581c', '#2f7a28', '#6aaa40', '#c6e878', '#f4b0c8'],
    summer: ['#184818', '#246824', '#4a9834', '#b6e060', '#f4f0c0'],
    fall: ['#8a4018', '#c46820', '#e09030', '#f0c050', '#f8e0a0'],
    winter: ['#8eacb8', '#c5dce8', '#e8f4f8', '#ffffff', '#f7fbff'],
  };
  const [a, b, c, d, flower] = sets[season] || sets.spring;
  pix(ctx, 7, 8, 2, 10, '#5a3820');
  pix(ctx, 6, 9, 1, 6, '#c4a06a');
  pix(ctx, 2, 0, 12, 9, a);
  pix(ctx, 0, 2, 16, 6, a);
  pix(ctx, 4, -2, 8, 4, b);
  pix(ctx, 1, 4, 6, 4, c);
  pix(ctx, 9, 3, 5, 4, d);
  pix(ctx, 6, 1, 3, 2, d);
  [[3, 2], [8, 0], [12, 4], [5, 6], [11, 7]].forEach(([x, y]) => pix(ctx, x, y, 1, 1, flower));
  if (season === 'winter') {
    pix(ctx, 2, 0, 12, 1, '#ffffff');
    pix(ctx, 4, -2, 8, 1, '#ffffff');
  }
}

function drawPine(ctx, season) {
  const leaf = season === 'winter' ? '#d7eef6' : season === 'fall' ? '#2a5820' : '#1a6428';
  const mid = season === 'winter' ? '#f7fbff' : '#2f8a38';
  const tip = season === 'winter' ? '#ffffff' : '#b6e868';
  pix(ctx, 7, 10, 2, 8, '#5a3820');
  pix(ctx, 6, 12, 1, 4, '#c4a06a');
  pix(ctx, 1, 8, 14, 3, leaf);
  pix(ctx, 3, 5, 10, 3, mid);
  pix(ctx, 5, 2, 6, 3, leaf);
  pix(ctx, 6, -1, 4, 3, tip);
  if (season === 'winter') {
    pix(ctx, 1, 8, 14, 1, '#ffffff');
    pix(ctx, 3, 5, 10, 1, '#ffffff');
    pix(ctx, 6, -1, 4, 1, '#ffffff');
  }
}

function drawSnowBush(ctx, season) {
  if (season === 'winter') {
    pix(ctx, 2, 8, 12, 6, '#6a9aa8');
    pix(ctx, 3, 6, 10, 4, '#9ec8d4');
    pix(ctx, 4, 5, 8, 2, '#e8f6fa');
    return;
  }
  const leaf = season === 'fall' ? '#c47830' : '#2a6a28';
  const lite = season === 'fall' ? '#e0a040' : '#3e8a34';
  pix(ctx, 2, 8, 12, 7, leaf);
  pix(ctx, 3, 6, 10, 4, lite);
  pix(ctx, 5, 5, 6, 2, season === 'fall' ? '#f0c060' : '#8ed860');
  const flower = season === 'fall' ? '#f4e0a0' : '#f4b0c8';
  pix(ctx, 4, 8, 1, 1, flower);
  pix(ctx, 8, 7, 1, 1, '#fff6ea');
  pix(ctx, 11, 9, 1, 1, flower);
}

function drawRock(ctx, season) {
  pix(ctx, 3, 8, 10, 6, '#8a8880');
  pix(ctx, 4, 6, 6, 4, '#b0aea4');
  pix(ctx, 5, 5, 4, 2, '#d8d6cc');
  pix(ctx, 8, 10, 4, 4, '#6a6860');
  pix(ctx, 5, 7, 2, 1, '#f4f2ea');
  if (season === 'winter') pix(ctx, 4, 5, 6, 1, '#ffffff');
}

function drawLog(ctx, season) {
  pix(ctx, 2, 11, 12, 3, '#6a4428');
  pix(ctx, 2, 11, 12, 1, season === 'winter' ? '#f4fbff' : '#c4a06a');
  pix(ctx, 1, 10, 2, 4, '#5a3820');
  pix(ctx, 13, 12, 2, 2, '#8a5a32');
}

function drawPath(ctx, season) {
  const gap = season === 'winter' ? '#d5e6f0' : '#8a6238';
  const wood = season === 'winter' ? '#d5ccc0' : '#c4985a';
  const lite = season === 'winter' ? '#f7fbff' : '#f0d8a0';
  pix(ctx, 0, 0, 16, 16, gap);
  for (let x = 1; x < 16; x += 4) {
    pix(ctx, x, 0, 3, 16, wood);
    pix(ctx, x, 0, 1, 16, lite);
    pix(ctx, x + 1, 4, 1, 1, lite);
    pix(ctx, x + 1, 12, 1, 1, lite);
  }
}

function drawShed(ctx, season) {
  const wall = season === 'winter' ? '#e8eef2' : '#c4a06a';
  const roof = season === 'winter' ? '#7a9098' : '#6a4428';
  pix(ctx, 1, 4, 26, 3, roof);
  pix(ctx, 3, 2, 22, 2, roof);
  pix(ctx, 2, 7, 24, 8, wall);
  pix(ctx, 11, 9, 5, 6, '#5a3820');
  pix(ctx, 5, 9, 3, 3, '#f0e0b0');
  pix(ctx, 18, 9, 3, 3, '#f0e0b0');
  pix(ctx, 13, 12, 1, 1, '#e0c080');
  if (season === 'winter') pix(ctx, 1, 4, 26, 1, '#ffffff');
}

function drawProp(ctx, col, row, season) {
  const kind = propKind(col, row);
  if (kind === 'path') drawPath(ctx, season);
  else if (kind === 'grass') drawGrassPatch(ctx, season);
  else if (kind === 'round') drawRoundTree(ctx, season, col);
  else if (kind === 'pine') drawPine(ctx, season);
  else if (kind === 'bush') drawSnowBush(ctx, season);
  else if (kind === 'rock') drawRock(ctx, season);
  else if (kind === 'log') drawLog(ctx, season);
  else if (kind === 'shed') drawShed(ctx, season);
}

function drawFenceH(ctx, season) {
  if (season === 'winter') {
    pix(ctx, 0, 8, 16, 1, '#6a4834');
    pix(ctx, 0, 12, 16, 1, '#5a3828');
    for (let x = 0; x < 16; x += 3) {
      pix(ctx, x, 4, 2, 10, '#7a5640');
      pix(ctx, x, 4, 2, 2, '#f4fbff');
      pix(ctx, x, 6, 1, 6, '#c4a080');
    }
    return;
  }
  pix(ctx, 0, 3, 3, 11, '#4a3018');
  pix(ctx, 1, 3, 1, 2, '#f0d8a8');
  pix(ctx, 1, 6, 1, 6, '#8a5a32');
  pix(ctx, 3, 5, 13, 2, '#6a4428');
  pix(ctx, 3, 5, 13, 1, '#e0c090');
  pix(ctx, 3, 10, 13, 2, '#5a3820');
  pix(ctx, 3, 10, 13, 1, '#a07848');
}

function drawFenceV(ctx, season) {
  if (season === 'winter') {
    pix(ctx, 6, 0, 1, 16, '#6a4834');
    pix(ctx, 10, 0, 1, 16, '#5a3828');
    for (let y = 0; y < 16; y += 3) {
      pix(ctx, 4, y, 8, 2, '#7a5640');
      pix(ctx, 4, y, 8, 1, '#f4fbff');
    }
    return;
  }
  pix(ctx, 4, 0, 3, 3, '#4a3018');
  pix(ctx, 5, 0, 1, 2, '#f0d8a8');
  pix(ctx, 6, 2, 2, 14, '#6a4428');
  pix(ctx, 6, 2, 1, 14, '#e0c090');
  pix(ctx, 10, 2, 2, 14, '#5a3820');
  pix(ctx, 10, 2, 1, 14, '#a07848');
}

function drawFence(ctx, col, row, season) {
  const horizontal = row === TILL_Y0 - 1 || row === TILL_Y1 + 1;
  const vertical = col === TILL_X0 - 1 || col === TILL_X1 + 1;
  if (horizontal) drawFenceH(ctx, season);
  if (vertical) drawFenceV(ctx, season);
}

function drawFarmer(ctx) {
  pix(ctx, 4, 3, 8, 1, '#e0b050');
  pix(ctx, 5, 1, 6, 2, '#f0c868');
  pix(ctx, 6, 3, 4, 1, '#c4923a');
  pix(ctx, 6, 4, 4, 2, '#f0c8a0');
  pix(ctx, 6, 4, 1, 1, '#3a2418');
  pix(ctx, 8, 4, 1, 1, '#3a2418');
  pix(ctx, 5, 6, 6, 2, '#e07030');
  pix(ctx, 3, 6, 2, 3, '#e07030');
  pix(ctx, 11, 6, 2, 3, '#e07030');
  pix(ctx, 5, 8, 6, 4, '#3a6aaa');
  pix(ctx, 6, 8, 1, 3, '#2a5088');
  pix(ctx, 9, 8, 1, 3, '#2a5088');
  pix(ctx, 4, 8, 1, 2, '#f0c8a0');
  pix(ctx, 11, 8, 1, 2, '#f0c8a0');
  pix(ctx, 5, 12, 2, 3, '#4a3424');
  pix(ctx, 9, 12, 2, 3, '#4a3424');
}

function applyTool(index) {
  const plot = Farm.plots[index];
  const col = index % FARM_W;
  const row = Math.floor(index / FARM_W);
  if (!plot || !inField(col, row)) return { ok: false, msg: '栅栏外面是草地。到田里再锄、浇、种。' };
  const today = farmStamp(new Date());
  const crop = cropById(plot.crop);
  if (Farm.tool === 'hoe') {
    if (plot.crop) return { ok: false, msg: '土里还有作物，锄头不会铲掉它。' };
    if (plot.tilled) return { ok: false, msg: '这块已经翻开了。' };
    plot.tilled = true;
    return { ok: true, msg: '土翻开了。选一包种子种下去。' };
  }
  if (Farm.tool === 'water') {
    if (!plot.tilled && !plot.crop) return { ok: false, msg: '先用锄头把草翻开。' };
    if (crop) {
      if (plot.stage >= crop.days) return { ok: false, msg: '已经熟了，可以收。' };
      if (plot.wateredAt) {
        const left = plot.wateredAt + RIPE_MS - Date.now();
        return { ok: false, msg: left > 0 ? `已经在长了。${waitText(left)}后熟。` : '已经熟了，可以收。' };
      }
      plot.wateredAt = Date.now();
      plot.wateredOn = today;
      return { ok: true, msg: '浇过了。大约四十分钟成熟。' };
    }
    if (plot.wateredOn === today) return { ok: false, msg: '今天浇过了。' };
    plot.wateredOn = today;
    return { ok: true, msg: '土湿了。种上之后再浇一次，大约四十分钟成熟。' };
  }
  if (Farm.tool === 'harvest') {
    if (!crop || plot.stage < crop.days) {
      if (!crop) return { ok: false, msg: '这里没有能收的。' };
      if (!plot.wateredAt) return { ok: false, msg: '还没熟。先浇水，大约四十分钟成熟。' };
      const left = plot.wateredAt + RIPE_MS - Date.now();
      return { ok: false, msg: left > 0 ? `还没熟。${waitText(left)}后可以收。` : '还没熟。' };
    }
    Farm.harvested[crop.id] = (Farm.harvested[crop.id] || 0) + 1;
    Farm.barn[crop.id] = (Farm.barn[crop.id] || 0) + 1;
    plot.crop = '';
    plot.stage = 0;
    plot.wateredOn = 0;
    plot.wateredAt = 0;
    plot.grownOn = 0;
    return { ok: true, name: crop.name, msg: `收起${crop.name}，放进背包。一颗能卖 ${crop.sell} 金。` };
  }
  if (Farm.tool === 'shovel') {
    if (plot.crop) {
      plot.crop = '';
      plot.stage = 0;
      plot.wateredOn = 0;
      plot.wateredAt = 0;
      plot.grownOn = 0;
      return { ok: true, msg: '铲掉了。种子不会退回来。' };
    }
    if (plot.tilled) {
      plot.tilled = false;
      plot.wateredOn = 0;
      return { ok: true, msg: '土又盖上草了。' };
    }
    return { ok: false, msg: '这里本来就是草地。' };
  }
  if (Farm.tool === 'seed') {
    const seed = cropById(Farm.seedId);
    if (!seed) return { ok: false, msg: '先从背包里拿出种子。按 B，或按 Q、E。' };
    if (!plot.tilled || plot.crop) return { ok: false, msg: plot.crop ? '这块已经种了。' : '先锄开，再种。' };
    if (seed.season !== farmSeason(new Date())) return { ok: false, msg: `${seed.name}不是这个季节的。` };
    if ((Farm.seeds[seed.id] || 0) <= 0) return { ok: false, msg: '种子用完了。' };
    Farm.seeds[seed.id] -= 1;
    if (Farm.seeds[seed.id] <= 0) delete Farm.seeds[seed.id];
    plot.crop = seed.id;
    plot.stage = 0;
    plot.wateredAt = 0;
    plot.grownOn = 0;
    return { ok: true, name: seed.name, msg: `${seed.name}种下了。浇上水，大约四十分钟成熟。` };
  }
  return { ok: false, msg: '' };
}

function usePlot(index) {
  const result = applyTool(index);
  if (result.msg) setHint(result.msg);
  if (!result.ok) return;
  Farm.paint();
  if (typeof queueSave === 'function') queueSave();
}

function paintTools() {
  const draw = {
    hoe(g) {
      g.fillStyle = '#6a4428';
      for (let i = 0; i < 9; i++) g.fillRect(2 + i, 12 - i, 2, 2);
      g.fillStyle = '#d8dce0';
      g.fillRect(9, 1, 6, 2);
      g.fillStyle = '#9aa0a8';
      g.fillRect(9, 3, 6, 1);
    },
    water(g) {
      g.fillStyle = '#3a7ec8';
      g.fillRect(1, 6, 8, 7);
      g.fillRect(3, 4, 4, 2);
      g.fillStyle = '#d8dce0';
      g.fillRect(8, 5, 6, 2);
      g.fillRect(12, 3, 2, 2);
      g.fillStyle = '#2a5a98';
      g.fillRect(0, 8, 2, 3);
    },
    harvest(g) {
      g.fillStyle = '#c47830';
      g.fillRect(2, 6, 12, 8);
      g.fillStyle = '#e8a050';
      g.fillRect(3, 7, 10, 2);
      g.fillStyle = '#6a4428';
      g.fillRect(4, 2, 1, 5);
      g.fillRect(11, 2, 1, 5);
      g.fillRect(4, 2, 8, 1);
      g.fillStyle = '#58a838';
      g.fillRect(6, 8, 2, 2);
      g.fillStyle = '#e04830';
      g.fillRect(9, 9, 2, 2);
    },
    shovel(g) {
      g.fillStyle = '#6a4428';
      g.fillRect(7, 0, 2, 8);
      g.fillStyle = '#d0d4d8';
      g.fillRect(4, 8, 8, 6);
      g.fillRect(5, 7, 6, 1);
      g.fillStyle = '#8a9098';
      g.fillRect(5, 13, 6, 1);
    },
  };
  document.querySelectorAll('#farm-tools canvas').forEach((canvas) => {
    const fn = draw[canvas.dataset.ico];
    if (!fn) return;
    const g = canvas.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, 16, 16);
    fn(g);
  });
}

function bindFarm() {
  const canvas = document.getElementById('farm');
  if (!canvas || canvas.dataset.bound) return;
  canvas.dataset.bound = '1';
  paintTools();
  document.querySelectorAll('#farm-tools button').forEach((button) => {
    button.addEventListener('click', () => {
      Farm.pickTool(button.dataset.tool);
    });
  });
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const left = Farm.camX - canvas.width / (2 * Farm.zoom);
    const top = Farm.camY - canvas.height / (2 * Farm.zoom);
    const col = Math.floor(left + x / Farm.zoom);
    const row = Math.floor(top + y / Farm.zoom);
    if (col < 0 || col >= FARM_W || row < 0 || row >= FARM_H) return;
    usePlot(row * FARM_W + col);
  });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    Farm.zoomBy(event.deltaY < 0 ? 1 : -1);
  }, { passive: false });
  Farm.paint();
}

bindFarm();
window.Farm = Farm;
