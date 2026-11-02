'use strict';

const DINO_W = 400;
const DINO_H = 180;
const DINO_GROUND = 148;
const STAND = 36;

const Dino = {
  best: 0,
  active: false,
  started: false,
  alive: true,
  ducking: false,
  score: 0,
  distance: 0,
  speed: 90,
  y: DINO_GROUND - STAND,
  vy: 0,
  obstacles: [],
  coins: [],
  spawnIn: 1.2,
  coinIn: 2.2,
  earned: 0,
  last: 0,

  load(best) {
    this.best = Math.max(0, Number(best) || 0);
    this.paintHud();
  },

  setActive(on) {
    this.active = !!on;
    this.paintHud();
    if (on) paintDino();
  },

  jump() {
    if (!this.started || !this.alive) this.start();
    if (this.y >= DINO_GROUND - STAND) this.vy = -280;
  },

  duck(down) {
    this.ducking = !!down && this.started && this.alive && this.y >= DINO_GROUND - STAND - 1;
  },

  start() {
    this.started = true;
    this.alive = true;
    this.ducking = false;
    this.score = 0;
    this.distance = 0;
    this.speed = 90;
    this.y = DINO_GROUND - STAND;
    this.vy = 0;
    this.obstacles = [];
    this.coins = [];
    this.spawnIn = 1.1;
    this.coinIn = 1.8;
    this.earned = 0;
    const hint = document.getElementById('dino-hint');
    if (hint) hint.textContent = '空格跳，下键低头。捡到金币马上入账，撞上再按分数结一笔。';
    this.paintHud();
  },

  paintHud() {
    const score = document.getElementById('dino-score');
    const best = document.getElementById('dino-best');
    if (score) score.textContent = this.started ? String(this.score) : '准备';
    if (best) best.textContent = `最好 ${this.best} · 本趟 ${this.earned} 金`;
  },
};

function dinoBox() {
  const duck = Dino.ducking;
  return {
    x: 28,
    y: duck ? DINO_GROUND - 16 : Dino.y + 8,
    w: duck ? 44 : 26,
    h: duck ? 12 : STAND - 16,
  };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function spawnCoin() {
  const crowded = Dino.obstacles.some((item) => Math.abs(item.x - (DINO_W + 8)) < 36);
  if (crowded) return;
  const high = Math.random() < 0.6;
  Dino.coins.push({ x: DINO_W + 8, y: high ? 72 : DINO_GROUND - 16, w: 10, h: 10 });
}

function takeCoin(amount) {
  const n = Math.max(0, Math.floor(amount) || 0);
  if (!n) return;
  Dino.earned += n;
  if (window.Farm) Farm.gain(n);
  if (typeof queueSave === 'function') queueSave();
}

function spawnObstacle() {
  const bird = Dino.score > 40 && Math.random() < 0.35;
  if (bird) {
    const high = Math.random() < 0.5;
    Dino.obstacles.push({ kind: 'bird', x: DINO_W + 8, y: high ? 52 : 96, w: 28, h: 12, frame: 0 });
    return;
  }
  const tall = Math.random() < 0.45;
  const h = tall ? 40 : 26;
  Dino.obstacles.push({ kind: 'cactus', x: DINO_W + 8, y: DINO_GROUND - h, w: tall ? 22 : 16, h, frame: 0 });
}

function stepDino(dt) {
  if (!Dino.started || !Dino.alive) return;
  Dino.speed = Math.min(210, Dino.speed + dt * 2.2);
  Dino.distance += Dino.speed * dt;
  Dino.score = Math.floor(Dino.distance / 18);
  Dino.vy += 460 * dt;
  Dino.y += Dino.vy * dt;
  if (Dino.y > DINO_GROUND - STAND) {
    Dino.y = DINO_GROUND - STAND;
    Dino.vy = 0;
  }
  Dino.spawnIn -= dt;
  if (Dino.spawnIn <= 0) {
    spawnObstacle();
    Dino.spawnIn = Math.max(0.95, 1.85 - Dino.speed / 220) + Math.random() * 0.4;
  }
  const body = dinoBox();
  Dino.obstacles.forEach((item) => {
    item.x -= Dino.speed * dt;
    item.frame += dt * 8;
  });
  Dino.obstacles = Dino.obstacles.filter((item) => item.x > -24);
  Dino.coinIn -= dt;
  if (Dino.coinIn <= 0) {
    spawnCoin();
    Dino.coinIn = Math.max(1.3, 2.4 - Dino.speed / 280) + Math.random() * 0.6;
  }
  const kept = [];
  Dino.coins.forEach((coin) => {
    coin.x -= Dino.speed * dt;
    if (coin.x <= -16) return;
    if (overlaps(body, coin)) {
      takeCoin(2);
      return;
    }
    kept.push(coin);
  });
  Dino.coins = kept;
  if (Dino.obstacles.some((item) => overlaps(body, hitOf(item)))) {
    Dino.alive = false;
    Dino.ducking = false;
    if (Dino.score > Dino.best) Dino.best = Dino.score;
    const bonus = Math.floor(Dino.score / 15);
    takeCoin(bonus);
    const hint = document.getElementById('dino-hint');
    if (hint) hint.textContent = `撞上了，跑了 ${Dino.score}。这趟进账 ${Dino.earned} 金。再点一次重来。`;
    if (typeof queueSave === 'function') queueSave();
  }
  Dino.paintHud();
}

function drawDinoScene(ctx) {
  ctx.clearRect(0, 0, DINO_W, DINO_H);
  ctx.fillStyle = '#c5ddf0';
  ctx.fillRect(0, 0, DINO_W, DINO_GROUND);
  ctx.fillStyle = '#f7f3ea';
  for (let x = 8; x < DINO_W; x += 28) {
    const bob = (Math.floor(Dino.distance / 8) + x) % 40;
    ctx.fillRect(x - (bob % 18), 14, 10, 3);
    ctx.fillRect(x - (bob % 18) + 4, 12, 6, 2);
  }
  ctx.fillStyle = '#c4a060';
  ctx.fillRect(0, DINO_GROUND, DINO_W, DINO_H - DINO_GROUND);
  ctx.fillStyle = '#8a6234';
  ctx.fillRect(0, DINO_GROUND, DINO_W, 2);
  const scroll = Math.floor(Dino.distance) % 8;
  ctx.fillStyle = '#a07848';
  for (let x = -scroll; x < DINO_W; x += 8) ctx.fillRect(x, DINO_GROUND + 6, 3, 1);
  Dino.obstacles.forEach((item) => {
    if (item.kind === 'bird') drawBird(ctx, item);
    else drawCactus(ctx, item);
  });
  Dino.coins.forEach((coin) => drawCoin(ctx, coin));
  drawRunner(ctx);
}

function hitOf(item) {
  if (item.kind !== 'cactus') return item;
  return { x: item.x + 3, y: item.y + 4, w: Math.max(6, item.w - 6), h: Math.max(8, item.h - 8) };
}

function drawRunner(ctx) {
  const x = 22;
  const y = Dino.ducking ? DINO_GROUND - 24 : Math.round(Dino.y);
  const leg = Math.floor(Dino.distance / 8) % 2;
  ctx.fillStyle = '#2a241c';
  if (Dino.ducking) {
    ctx.fillRect(x, y + 8, 42, 14);
    ctx.fillRect(x + 34, y + 2, 16, 12);
    ctx.fillStyle = '#f6e2c0';
    ctx.fillRect(x + 42, y + 4, 4, 4);
    ctx.fillStyle = '#1a140e';
    ctx.fillRect(x + 44, y + 5, 2, 2);
    return;
  }
  ctx.fillRect(x - 10, y + 18, 12, 4);
  ctx.fillStyle = '#3a3428';
  ctx.fillRect(x + 2, y + 14, 24, 16);
  ctx.fillStyle = '#6a5644';
  ctx.fillRect(x + 6, y + 22, 16, 6);
  ctx.fillStyle = '#3a3428';
  ctx.fillRect(x + 20, y + 6, 10, 14);
  ctx.fillRect(x + 28, y + 2, 16, 12);
  ctx.fillRect(x + 42, y + 6, 6, 4);
  ctx.fillStyle = '#f6e2c0';
  ctx.fillRect(x + 34, y + 4, 5, 5);
  ctx.fillStyle = '#1a140e';
  ctx.fillRect(x + 36, y + 6, 2, 2);
  ctx.fillStyle = '#3a3428';
  ctx.fillRect(x + 16, y + 20, 6, 3);
  ctx.fillRect(x + 8, y + 30, 5, leg ? 8 : 4);
  ctx.fillRect(x + 16, y + 30, 5, leg ? 4 : 8);
}

function drawCactus(ctx, item) {
  const x = Math.round(item.x);
  const y = Math.round(item.y);
  ctx.fillStyle = '#3d8a32';
  ctx.fillRect(x + 6, y, 8, item.h);
  ctx.fillRect(x, y + 8, 8, 6);
  ctx.fillRect(x + 1, y + 8, 4, 14);
  ctx.fillRect(x + 12, y + 16, 8, 6);
  ctx.fillRect(x + 16, y + 16, 4, 12);
  ctx.fillStyle = '#9adf62';
  ctx.fillRect(x + 8, y + 2, 2, Math.max(4, item.h - 4));
  ctx.fillStyle = '#2f6a28';
  for (let i = 4; i < item.h; i += 5) ctx.fillRect(x + 6, y + i, 1, 2);
}

function drawCoin(ctx, coin) {
  const x = Math.round(coin.x);
  const y = Math.round(coin.y);
  ctx.fillStyle = '#c88818';
  ctx.fillRect(x + 2, y, 6, 10);
  ctx.fillRect(x, y + 2, 10, 6);
  ctx.fillStyle = '#f8d868';
  ctx.fillRect(x + 2, y + 2, 6, 6);
  ctx.fillStyle = '#a86810';
  ctx.fillRect(x + 4, y + 2, 2, 6);
}

function drawBird(ctx, item) {
  const x = Math.round(item.x);
  const y = Math.round(item.y);
  const up = Math.floor(item.frame) % 2 === 0;
  ctx.fillStyle = '#5a4030';
  ctx.fillRect(x + 6, y + 4, 16, 6);
  ctx.fillRect(x + 18, y + 2, 8, 6);
  ctx.fillRect(x, up ? y : y + 8, 12, 4);
  ctx.fillRect(x + 10, up ? y + 8 : y, 10, 4);
  ctx.fillStyle = '#f6e2c0';
  ctx.fillRect(x + 22, y + 3, 2, 2);
  ctx.fillStyle = '#1a140e';
  ctx.fillRect(x + 23, y + 3, 1, 1);
}

function paintDino() {
  const canvas = document.getElementById('dino');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawDinoScene(ctx);
}

let dinoLast = 0;
function dinoFrame(now) {
  const dt = Math.min(0.05, dinoLast ? (now - dinoLast) / 1000 : 0.016);
  dinoLast = now;
  if (Dino.active) {
    stepDino(dt);
    paintDino();
  }
  requestAnimationFrame(dinoFrame);
}

function bindDino() {
  const canvas = document.getElementById('dino');
  if (!canvas || canvas.dataset.bound) return;
  canvas.dataset.bound = '1';
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    Dino.jump();
  });
  requestAnimationFrame(dinoFrame);
}

bindDino();
window.Dino = Dino;
