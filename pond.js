'use strict';

const ART = {
  tiny: [' 111', '1211', ' 111'],
  fish: ['  1111 ', ' 111111', '1211111', ' 11111 ', '  111  '],
  long: ['  111111', '12111111', ' 111111 ', '  1111  '],
  koi: ['  1311 ', ' 113111', '1213111', ' 13111 ', '  111  '],
  clown: ['  3113 ', ' 113111', '1231113', ' 31113 ', '  111  '],
  tie: ['  1111 ', ' 113111', '1211311', ' 11131 ', '  111  '],
  shrimp: ['1  1', '11111', '  11 ', ' 1   '],
  crab: ['1 1 1', '11111', '1 1 1'],
  star: ['  1 ', '11111', ' 111', '1 1 1'],
  jelly: [' 111 ', '12111', ' 1 1 ', ' 1 1 '],
  boot: [' 11 ', ' 11 ', '1111'],
  can: ['1111', '1331', '1111'],
  note: ['1111', '1221', '1211'],
  weed: ['1 1', ' 1 ', '1 1'],
  leaf: ['  11', ' 111', '11  '],
  snail: [' 111', '11111', '1 1 1'],
  frog: ['1   1', ' 111 ', '11111'],
  turtle: [' 111 ', '11111', '1 1 1'],
};

const SCENES = [
  { id: 'blue', name: '蓝洞', sky: '#bff4f0', surface: '#3ec8d4', mid: '#0e4e78', deep: '#071018', bank: '#d8c898', accent: '#2f8f62' },
  { id: 'cave', name: '洞穴', sky: '#1a120c', surface: '#9af0d8', mid: '#148a74', deep: '#063028', bank: '#3a3028', accent: '#f4f0c8' },
  { id: 'deep', name: '深海', sky: '#063058', surface: '#0a4070', mid: '#082848', deep: '#040c16', bank: '#101820', accent: '#8ec8f0' },
  { id: 'river', name: '江河', sky: '#c5e4f4', surface: '#6a9a78', mid: '#3d7a62', deep: '#1e4a40', bank: '#6a5838', accent: '#2f6a32' },
  { id: 'shore', name: '浅海', sky: '#8fd4f4', surface: '#3aa0d8', mid: '#1a78b0', deep: '#0e4870', bank: '#e6d2a0', accent: '#e07058' },
];
const MAP_UNLOCK = [
  { id: 'blue', price: 0 },
  { id: 'deep', price: 800 },
  { id: 'cave', price: 1800 },
  { id: 'shore', price: 3600 },
  { id: 'river', price: 7200 },
];
const SCENE_ALIAS = {
  pond: 'river', sea: 'shore', rain: 'river', tank: 'river',
  donghai: 'shore', reef: 'shore', karst: 'cave', mekong: 'river', amazon: 'river',
};

const LOOT = [
  { id: 'minnow', name: '麦穗鱼', rarity: 'common', art: 'tiny', chance: 16, jin: [0.02, 0.06], color: '#e6d2a8', scenes: ['river'], line: '小得刚好能被看见。' },
  { id: 'crucian', name: '鲫鱼', rarity: 'common', art: 'fish', chance: 16, jin: [0.2, 0.8], color: '#e0b878', scenes: ['river'], line: '安静，实在，像一杯温水。' },
  { id: 'shrimp', name: '河虾', rarity: 'common', art: 'shrimp', chance: 12, jin: [0.02, 0.05], color: '#e7a0a0', scenes: ['river'], line: '轻轻一弹，下午就活了。' },
  { id: 'loach', name: '泥鳅', rarity: 'common', art: 'long', chance: 10, jin: [0.05, 0.18], color: '#a08868', scenes: ['river'], line: '滑一下，算打过招呼。' },
  { id: 'bitter', name: '鳑鲏', rarity: 'common', art: 'tiny', chance: 10, jin: [0.02, 0.05], color: '#f0c0b0', scenes: ['river'], line: '一身银边，胆子却很小。' },
  { id: 'tilapia', name: '罗非鱼', rarity: 'common', art: 'fish', chance: 8, jin: [0.3, 0.9], color: '#b0c080', scenes: ['river'], line: '外来的，在这儿过得不错。' },
  { id: 'snail', name: '田螺', rarity: 'common', art: 'snail', chance: 8, jin: [0.02, 0.08], color: '#8a9a58', scenes: ['river'], line: '慢，但是它会到。' },
  { id: 'bream', name: '鳊鱼', rarity: 'uncommon', art: 'fish', chance: 6, jin: [0.4, 1.2], color: '#d8d0c0', scenes: ['river'], line: '扁扁的，像一封没写完的信。' },
  { id: 'yellow', name: '黄颡鱼', rarity: 'uncommon', art: 'fish', chance: 6, jin: [0.15, 0.55], color: '#d8c060', scenes: ['river'], line: '胡须一抖，别着急。' },
  { id: 'catfish', name: '鲶鱼', rarity: 'uncommon', art: 'long', chance: 5, jin: [0.6, 2.2], color: '#6a6a58', scenes: ['river'], line: '沉在底下，不跟别人抢。' },
  { id: 'carp', name: '鲤鱼', rarity: 'uncommon', art: 'fish', chance: 6, jin: [0.8, 2.2], color: '#e09858', scenes: ['river'], line: '先跃过这个下午。' },
  { id: 'grass', name: '草鱼', rarity: 'uncommon', art: 'fish', chance: 5, jin: [1.0, 3.2], color: '#78a868', scenes: ['river'], line: '提起来的时候，竿尖会弯一下。' },
  { id: 'silver', name: '鲢鱼', rarity: 'uncommon', art: 'fish', chance: 5, jin: [0.7, 2.0], color: '#e4e8ee', scenes: ['river'], line: '银光一闪，像把烦心事递走。' },
  { id: 'goldfish', name: '金鱼', rarity: 'rare', art: 'long', chance: 4, jin: [0.05, 0.16], color: '#f0a030', scenes: ['river'], line: '多半是从鱼缸里翘班出来的。' },
  { id: 'gui', name: '鳜鱼', rarity: 'rare', art: 'fish', chance: 3, jin: [0.4, 1.3], color: '#6a9a58', scenes: ['river'], line: '花纹整齐，像自己打扮过。' },
  { id: 'snake', name: '黑鱼', rarity: 'rare', art: 'long', chance: 3, jin: [0.8, 2.6], color: '#3c4a3c', scenes: ['river'], line: '不爱出声，力气却是真的。' },
  { id: 'koi', name: '锦鲤', rarity: 'rare', art: 'koi', chance: 3, jin: [0.6, 1.8], color: '#f4f0e8', spot: '#e25b4a', scenes: ['river'], line: '红的。今天宜发呆。' },
  { id: 'medaka', name: '青鳉', rarity: 'legendary', art: 'tiny', chance: 1.1, jin: [0.01, 0.03], color: '#c8b878', scenes: ['river'], where: '东亚的稻田、沟渠和缓流。中国、朝鲜半岛、日本都有', water: '淡水', size: '2–4 厘米', line: '贴着水面停着，眼睛很大。' },
  { id: 'golden', name: '金锦鲤', rarity: 'legendary', art: 'koi', chance: 0.7, jin: [1.2, 2.8], color: '#ffd56a', spot: '#fff6d8', scenes: ['river'], line: '碰到它的人，可以早点合上电脑。' },
  { id: 'frog', name: '雨蛙', rarity: 'uncommon', art: 'frog', chance: 8, jin: [0.02, 0.08], color: '#68a848', scenes: ['river'], line: '叫了一声，雨就小了些。' },
  { id: 'turtle', name: '小乌龟', rarity: 'rare', art: 'turtle', chance: 3, jin: [0.15, 0.5], color: '#6a8a48', scenes: ['river'], line: '壳在，就不慌。' },
  { id: 'rainkoi', name: '雨中锦鲤', rarity: 'legendary', art: 'koi', chance: 1.2, jin: [0.5, 1.6], color: '#f4f0e8', spot: '#e25b4a', scenes: ['river'], line: '雨天出门的那条，会记得你。' },
  { id: 'sardine', name: '沙丁鱼', rarity: 'common', art: 'tiny', chance: 16, jin: [0.05, 0.15], color: '#d8e4ee', scenes: ['shore'], line: '成群的时候才安心。' },
  { id: 'pomfret', name: '鲳鱼', rarity: 'common', art: 'fish', chance: 10, jin: [0.3, 0.9], color: '#e8e0c8', scenes: ['shore'], line: '扁，亮，一下就过去了。' },
  { id: 'hairtail', name: '带鱼', rarity: 'uncommon', art: 'long', chance: 8, jin: [0.4, 1.4], color: '#d0d6de', scenes: ['shore'], line: '细长的一条银。' },
  { id: 'flounder', name: '比目鱼', rarity: 'uncommon', art: 'fish', chance: 7, jin: [0.3, 1.0], color: '#c4b48a', scenes: ['shore'], line: '两只眼睛挤在同一侧看世界。' },
  { id: 'crab', name: '螃蟹', rarity: 'uncommon', art: 'crab', chance: 8, jin: [0.1, 0.4], color: '#d07048', scenes: ['shore'], line: '横着走，也不算走偏。' },
  { id: 'star', name: '海星', rarity: 'common', art: 'star', chance: 8, jin: [0.05, 0.2], color: '#e09058', scenes: ['shore'], line: '五只角，都不着急。' },
  { id: 'jelly', name: '海月水母', rarity: 'uncommon', art: 'jelly', chance: 6, jin: [0.08, 0.3], color: '#f0e8ff', scenes: ['shore'], line: '软，透，不跟谁争。' },
  { id: 'skipper', name: '弹涂鱼', rarity: 'uncommon', art: 'fish', chance: 10, jin: [0.05, 0.2], color: '#8a9a68', scenes: ['shore'], line: '能上岸，也能回来。' },
  { id: 'clown', name: '小丑鱼', rarity: 'rare', art: 'clown', chance: 4, jin: [0.05, 0.15], color: '#f0a030', spot: '#f4f7fb', scenes: ['shore'], line: '颜色很响，人可以小声。' },
  { id: 'horse', name: '海马', rarity: 'rare', art: 'tiny', chance: 3, jin: [0.02, 0.06], color: '#e0a050', scenes: ['shore'], line: '它用尾巴挂着，不赶路。' },
  { id: 'dragon', name: '海龙', rarity: 'legendary', art: 'long', chance: 1, jin: [0.15, 0.4], color: '#68d0c0', scenes: ['shore'], line: '像一句还没说出口的好消息。' },
  { id: 'bat', name: '蝙蝠鱼', rarity: 'uncommon', art: 'fish', chance: 8, jin: [0.2, 0.7], color: '#5a4868', scenes: ['shore'], line: '翅膀一样的鳍，并不飞。' },
  { id: 'blind', name: '盲鱼', rarity: 'common', art: 'fish', chance: 14, jin: [0.05, 0.2], color: '#e8e0ea', scenes: ['cave'], line: '看不见，可是认得路。' },
  { id: 'cshrimp', name: '洞穴虾', rarity: 'common', art: 'shrimp', chance: 12, jin: [0.02, 0.06], color: '#f0d8c8', scenes: ['cave'], line: '在暗处也把触须伸直。' },
  { id: 'diabolica', name: '火焰眼鳅', rarity: 'rare', art: 'tiny', chance: 4, jin: [0.01, 0.03], color: '#c8a060', scenes: ['cave'], where: '婆罗洲林间溪流的石缝和落叶堆', water: '淡水', size: '3–5 厘米', line: '眼睛周围发红，贴着沙底。' },
  { id: 'confuzona', name: '迷纹平鳍鳅', rarity: 'rare', art: 'fish', chance: 3, jin: [0.02, 0.06], color: '#c8b070', scenes: ['cave'], where: '东南亚喀斯特溪流的石面', water: '淡水', size: '4–7 厘米', line: '身上的纹像画乱的线条，吸在石头上。' },
  { id: 'kubotai', name: '库氏沙鳅', rarity: 'legendary', art: 'fish', chance: 1, jin: [0.04, 0.12], color: '#d8c878', scenes: ['cave'], where: '缅甸和泰国边境的溪流', water: '淡水', size: '6–12 厘米', line: '身上一串浅斑，爱钻石头缝。' },
  { id: 'betta', name: '斗鱼', rarity: 'rare', art: 'long', chance: 6, jin: [0.04, 0.12], color: '#d04868', scenes: ['river'], line: '鳍张开，像把伞。' },
  { id: 'guppy', name: '孔雀鱼', rarity: 'common', art: 'tiny', chance: 16, jin: [0.01, 0.03], color: '#f0c060', scenes: ['river'], line: '尾巴一甩，格子间就亮了。' },
  { id: 'angel', name: '神仙鱼', rarity: 'uncommon', art: 'fish', chance: 8, jin: [0.05, 0.15], color: '#f0e8d8', scenes: ['river'], line: '游得很慢，像在排队。' },
  { id: 'oscar', name: '地图鱼', rarity: 'rare', art: 'fish', chance: 4, jin: [0.3, 0.9], color: '#e08048', scenes: ['river'], line: '身上的纹路比日程还花。' },
  { id: 'pleco', name: '清道夫', rarity: 'uncommon', art: 'long', chance: 7, jin: [0.1, 0.4], color: '#5a5040', scenes: ['river'], line: '专门收拾别人留下的。' },
  { id: 'paradise', name: '圆尾斗鱼', rarity: 'legendary', art: 'long', chance: 1, jin: [0.02, 0.08], color: '#4060c0', scenes: ['river'], where: '中国华南到东南亚的稻田、池塘和缓流', water: '淡水', size: '5–10 厘米', line: '鳍张开时，蓝边和红尾一起露出来。' },
  { id: 'boot', name: '破草鞋', rarity: 'junk', art: 'boot', chance: 5, color: '#8a6246', scenes: ['river', 'shore'], line: '鞋还在，人已经回家了。' },
  { id: 'can', name: '易拉罐', rarity: 'junk', art: 'can', chance: 4, color: '#d5dee6', spot: '#d04545', scenes: ['river', 'shore', 'blue'], line: '还剩一点点气。' },
  { id: 'weed', name: '一缕水草', rarity: 'junk', art: 'weed', chance: 4, color: '#3f8f62', scenes: ['river'], line: '绿的，软的，不催你。' },
  { id: 'note', name: '湿纸条', rarity: 'junk', art: 'note', chance: 3, color: '#f3ead7', scenes: ['river'], line: '字泡开了：今天也辛苦了。' },
  { id: 'bottle', name: '漂流瓶', rarity: 'junk', art: 'can', chance: 3, color: '#8fd0e0', scenes: ['shore', 'blue', 'deep'], line: '里面是空的，刚好能装一点风。' },
  { id: 'lamp', name: '旧矿灯', rarity: 'junk', art: 'can', chance: 4, color: '#e0c060', scenes: ['cave', 'deep'], line: '不亮了，可是有人用过。' },
  { id: 'leaf', name: '落叶', rarity: 'junk', art: 'leaf', chance: 6, color: '#c47838', scenes: ['river'], line: '它先下班。' },
  { id: 'umbrella', name: '小纸伞', rarity: 'junk', art: 'note', chance: 3, color: '#e07070', scenes: ['river'], line: '撑过一小会儿就好。' },
];
(window.EXTRA_FISH || []).forEach((item) => LOOT.push(item));

const RARITY_NAME = { common: '常见', uncommon: '少见', rare: '稀有', legendary: '传说', junk: '意外收获' };
const FISH_PRICE = { junk: 8, common: 22, uncommon: 48, rare: 110, legendary: 260 };
const IDLE_HINTS = ['水面很静。想钓的时候，抛一下竿。', '发一会儿呆也算数。', '没有配额。'];
const WAIT_HINTS = ['浮漂轻轻点着。你可以先回去忙。', '水在发呆，你也可以。', '它要是来，会自己告诉你。'];
const MISS_HINTS = ['跑了。水面很快又平了。', '没关系，塘还在。'];

const Pond = {
  hooks: {},
  sceneId: 'blue',
  album: { counts: {}, best: {}, stock: {}, todayFish: 0, day: '', pity: 0 },
  auto: false,
  sound: true,
  mode: 'idle',
};

(function pondModule() {
  const frame = document.getElementById('frame');
  const canvas = document.getElementById('pond');
  const ctx = canvas.getContext('2d');
  const portrait = document.getElementById('portrait');
  const portraitCtx = portrait.getContext('2d');
  const hintEl = document.getElementById('hint');
  const actionEl = document.getElementById('action');
  const biteFlag = document.getElementById('bite-flag');
  const bookEl = document.getElementById('book');
  const cardEl = document.getElementById('card');
  const scenesEl = document.getElementById('scenes');
  const dexEl = document.getElementById('dex');
  const SCALE = 2;
  const SCENE_ART = {
    deep: 'scenes/deep.jpg',
    river: 'scenes/river.jpg',
    cave: 'scenes/cave.jpg',
    shore: 'scenes/shore.jpg',
    blue: 'scenes/blue.jpg',
  };
  const WATER = {
    river: [
      { x: 0.42, y: 0.54, w: 0.16, h: 0.07 },
      { x: 0.36, y: 0.61, w: 0.30, h: 0.08 },
      { x: 0.38, y: 0.70, w: 0.32, h: 0.12 },
    ],
    deep: [
      { x: 0.44, y: 0.24, w: 0.12, h: 0.50 },
    ],
    cave: [
      { x: 0.24, y: 0.58, w: 0.18, h: 0.14 },
      { x: 0.44, y: 0.56, w: 0.18, h: 0.16 },
    ],
    shore: [
      { x: 0.46, y: 0.08, w: 0.46, h: 0.24 },
      { x: 0.72, y: 0.28, w: 0.20, h: 0.22 },
    ],
    blue: [
      { x: 0.43, y: 0.43, w: 0.14, h: 0.14 },
    ],
  };
  const sceneImages = {};

  let pw = 120;
  let ph = 80;
  let dot = 1;
  let openMaps = ['blue'];
  let modeUntil = 0;
  let waitUntil = 0;
  let approachAt = 0;
  let biteUntil = 0;
  let pending = null;
  let pendingJin = 0;
  let pendingNew = false;
  let bobber = null;
  let visitor = null;
  let cardTimer = 0;
  let audioCtx = null;
  let lastNow = performance.now();
  const ambient = [];
  const particles = [];

  function dateKey(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function mapCost(id) {
    const row = MAP_UNLOCK.find((item) => item.id === id);
    return row ? row.price : 0;
  }
  function mapOpen(id) {
    return mapCost(id) === 0 || openMaps.includes(id);
  }
  function buyMap(item) {
    if (Pond.mode !== 'idle' && Pond.mode !== 'showing') {
      setHint('先把这一竿处理完。');
      return;
    }
    const price = mapCost(item.id);
    const have = window.Farm ? Farm.gold : 0;
    if (!window.Farm || !Farm.trySpend(price)) {
      setHint(`${item.name}要 ${price} 金，还差 ${Math.max(0, price - have)} 金。`);
      return;
    }
    if (!openMaps.includes(item.id)) openMaps.push(item.id);
    Pond.sceneId = item.id;
    spawnAmbient();
    renderScenes();
    setHint(`${item.name}打开了。这里的鱼卖得更贵。`);
    emit('change');
  }
  function scene() { return SCENES.find((item) => item.id === Pond.sceneId) || SCENES[0]; }
  function hourMood() {
    const h = new Date().getHours();
    if (h >= 19 || h < 5) return 'night';
    if (h >= 16) return 'dusk';
    return 'day';
  }
  function pool() {
    const list = LOOT.filter((item) => item.scenes.includes(Pond.sceneId));
    return list.length ? list : LOOT;
  }
  function emit(name, payload) {
    if (typeof Pond.hooks[name] === 'function') Pond.hooks[name](payload);
  }
  function refreshDex() {
    const found = LOOT.filter((item) => Pond.album.counts[item.id]).length;
    dexEl.textContent = `${found}/${LOOT.length}`;
  }

  function rollLoot() {
    const mood = hourMood();
    const entries = pool().map((item) => {
      let weight = item.chance;
      if (item.id === 'moon' && mood === 'night') weight *= 2.6;
      if (item.rarity === 'legendary') weight *= 1 + Pond.album.pity / 22;
      if ((Pond.sceneId === 'cave' || Pond.sceneId === 'deep') && item.rarity === 'legendary') weight *= 1.3;
      return { item, weight };
    });
    let r = Math.random() * entries.reduce((sum, entry) => sum + entry.weight, 0);
    for (const entry of entries) {
      r -= entry.weight;
      if (r <= 0) return entry.item;
    }
    return entries[0].item;
  }
  function pickJin(item) {
    if (!item.jin) return 0;
    const [a, b] = item.jin;
    const t = Math.pow(Math.random(), 1.35);
    return a + (b - a) * t;
  }
  function formatJin(jin) {
    if (!jin) return '';
    if (jin < 0.1) return `${Math.max(1, Math.round(jin * 500))} 克`;
    return `${jin.toFixed(jin >= 10 ? 0 : 1)} 斤`;
  }

  function ensureAudio() {
    if (!Pond.sound) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function tone(freq, dur, gain, slide) {
    const ac = ensureAudio();
    if (!ac) return;
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), ac.currentTime + dur);
    amp.gain.setValueAtTime(gain, ac.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0008, ac.currentTime + dur);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  }
  function playCast() { tone(220, 0.12, 0.03, 90); }
  function playBite() { tone(660, 0.08, 0.04); setTimeout(() => tone(880, 0.08, 0.035), 100); }
  function playCatch(item) {
    const notes = item.rarity === 'legendary' ? [523, 659, 784] : item.rarity === 'junk' ? [196, 164] : [494, 659];
    notes.forEach((freq, i) => setTimeout(() => tone(freq, 0.16, 0.035), i * 90));
  }
  function playMiss() { tone(180, 0.16, 0.03, 90); }

  function setHint(text) { hintEl.textContent = text; }
  function syncAction() {
    const labels = { idle: '抛竿', casting: '抛出', waiting: '收竿', biting: '提竿', leaping: '上来了', escaping: '跑了', showing: '抛竿' };
    actionEl.textContent = labels[Pond.mode] || '抛竿';
    actionEl.classList.toggle('bite', Pond.mode === 'biting');
    actionEl.classList.toggle('ghost', Pond.mode === 'waiting');
    actionEl.disabled = Pond.mode === 'casting' || Pond.mode === 'leaping' || Pond.mode === 'escaping';
    actionEl.hidden = cardEl.classList.contains('show');
    biteFlag.classList.toggle('on', Pond.mode === 'biting');
    emit('mode', Pond.mode);
  }

  function measure() {
    const rect = frame.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    const photo = !!SCENE_ART[Pond.sceneId];
    const scale = photo ? 1 : SCALE;
    dot = photo ? SCALE : 1;
    pw = Math.max(40, Math.floor(rect.width / scale));
    ph = Math.max(30, Math.floor(rect.height / scale));
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    ctx.imageSmoothingEnabled = false;
  }

  function spawnAmbient() {
    ambient.length = 0;
    const colors = pool().filter((item) => item.rarity !== 'junk').slice(0, 6);
    for (let i = 0; i < 5; i++) {
      const sample = colors[i % colors.length] || LOOT[0];
      ambient.push({
        nx: Math.random(),
        ny: 0.36 + Math.random() * 0.36,
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 0.05 + Math.random() * 0.05,
        item: sample,
        phase: Math.random() * 6,
      });
    }
  }

  function photoOf(id) {
    const table = window.FISH_PHOTO;
    const photo = table && table[id];
    return photo && photo.src ? photo : null;
  }

  function drawPhoto(g, id, x, y, w, h) {
    const photo = photoOf(id);
    if (!photo) return false;
    if (!photo.img) {
      photo.img = new Image();
      photo.img.src = photo.src;
    }
    const img = photo.img;
    if (!img.complete || !img.naturalWidth) return false;
    const fit = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * fit;
    const dh = img.naturalHeight * fit;
    g.imageSmoothingEnabled = true;
    g.drawImage(img, Math.round(x - dw / 2), Math.round(y - dh / 2), Math.round(dw), Math.round(dh));
    return true;
  }

  function blit(g, item, x, y, scale, flip, ghost) {
    const s = scale || 1;
    if (item && drawPhoto(g, item.id, x, y, 64 * s, 36 * s)) return;
    if (window.Sprites && item) Sprites.draw(g, item, x, y, s, !!flip, !!ghost);
  }

  function plotLine(x0, y0, x1, y1, color) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    ctx.fillStyle = color;
    for (let n = 0; n < pw + ph + 8; n++) {
      ctx.fillRect(x0, y0, dot, dot);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  function rodTip() {
    const base = { x: pw - 10 * dot, y: ph - 6 * dot };
    const aim = mainWaterPoint();
    const rest = aim
      ? { x: Math.round(aim.x), y: Math.round(Math.max(ph * 0.16, aim.y - ph * 0.06)) }
      : { x: Math.round(pw * 0.62), y: Math.round(ph * 0.28) };
    if (Pond.mode === 'casting') {
      const p = clamp(1 - (modeUntil - performance.now()) / 620, 0, 1);
      return {
        base,
        tip: {
          x: Math.round(base.x + (rest.x - base.x) * p),
          y: Math.round((base.y - ph * 0.2) + (rest.y - (base.y - ph * 0.2)) * p),
        },
      };
    }
    return { base, tip: rest };
  }

  function bobberXY(now) {
    if (!bobber) return null;
    let y = bobber.ny * ph + Math.sin(now / 280) * 0.6 * dot;
    if (Pond.mode === 'biting' || Pond.mode === 'leaping') y += (2 + (Math.floor(now / 140) % 2)) * dot;
    return { x: bobber.nx * pw, y };
  }

  function drawBobber(x, y) {
    ctx.fillStyle = '#d04545';
    ctx.fillRect(Math.round(x), Math.round(y) - 3 * dot, 2 * dot, 2 * dot);
    ctx.fillStyle = '#f4f0e4';
    ctx.fillRect(Math.round(x), Math.round(y) - dot, 2 * dot, 2 * dot);
  }

  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (shift) => Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }
  function band(y0, y1, a, b) {
    const top = Math.max(0, Math.round(y0));
    const bot = Math.min(ph, Math.round(y1));
    for (let y = top; y < bot; y++) {
      ctx.fillStyle = mix(a, b, (y - top) / Math.max(1, bot - top - 1));
      ctx.fillRect(0, y, pw, 1);
    }
  }
  function fillEllipse(cx, cy, rx, ry, color) {
    if (rx < 0.5 || ry < 0.5) return;
    ctx.fillStyle = color;
    const y0 = Math.max(0, Math.floor(cy - ry));
    const y1 = Math.min(ph - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      const ny = (y + 0.5 - cy) / ry;
      const span = rx * Math.sqrt(Math.max(0, 1 - ny * ny));
      const x0 = Math.max(0, Math.round(cx - span));
      const x1 = Math.min(pw, Math.round(cx + span));
      if (x1 > x0) ctx.fillRect(x0, y, x1 - x0, 1);
    }
  }
  function ledge() {
    ctx.fillStyle = '#4a3828';
    ctx.fillRect(pw - 22, ph - 8, 22, 8);
    ctx.fillStyle = '#8a6848';
    ctx.fillRect(pw - 20, ph - 7, 18, 2);
    ctx.fillRect(pw - 20, ph - 3, 18, 2);
  }
  function drawBlue(now) {
    band(0, ph, '#e9fffb', '#3ec8dc');
    const cx = pw * 0.5;
    const cy = ph * 0.46;
    const rx = pw * 0.46;
    const ry = ph * 0.4;
    const reef = ['#ead8a8', '#1c6848', '#2f9068', '#14543c', '#5ec8b0', '#2f9068', '#c47868', '#1c6848'];
    for (let y = 0; y < ph; y++) {
      let runC = '';
      let runX = 0;
      for (let x = 0; x <= pw; x++) {
        let color = '';
        if (x < pw) {
          const nx = (x - cx) / rx;
          const ny = (y - cy) / ry;
          const ang = Math.atan2(ny, nx);
          const wobble = 1 + Math.sin(ang * 4 + 1.1) * 0.08 + Math.sin(ang * 9) * 0.035;
          const d = Math.sqrt(nx * nx + ny * ny) / wobble;
          if (d < 0.24) color = '#05080e';
          else if (d < 0.4) color = '#0c3050';
          else if (d < 0.5) color = '#1a6890';
          else if (d < 0.96) color = reef[((x * 17) ^ (y * 13)) & 7];
          else if (d < 1.16) color = '#9ae6d4';
        }
        if (color !== runC) {
          if (runC) {
            ctx.fillStyle = runC;
            ctx.fillRect(runX, y, x - runX, 1);
          }
          runC = color;
          runX = x;
        }
      }
    }
    const glint = Math.sin(now / 700);
    fillEllipse(cx - rx * 0.08, cy - ry * 0.12, rx * 0.14, ry * 0.06, glint > 0 ? 'rgba(210,240,255,0.4)' : 'rgba(210,240,255,0.16)');
    ctx.fillStyle = '#6a4a30';
    ctx.fillRect(pw - 16, ph - 12, 16, 12);
    ctx.fillStyle = '#c4a06a';
    for (let i = 0; i < 4; i++) ctx.fillRect(pw - 14, ph - 10 + i * 3, 12, 1);
  }
  function fang(x, top, h, w, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < h; i++) {
      const ww = Math.max(1, Math.round(w * (1 - i / h)));
      ctx.fillRect(Math.round(x + (w - ww) / 2), Math.round(top + i), ww, 1);
    }
  }
  function drawCave(now) {
    ctx.fillStyle = '#120e0c';
    ctx.fillRect(0, 0, pw, ph);
    for (let y = 0; y < ph; y++) {
      const left = Math.round(pw * (0.08 + Math.sin(y * 0.04) * 0.04));
      const right = Math.round(pw * (0.9 + Math.sin(y * 0.05) * 0.03));
      ctx.fillStyle = y % 11 < 2 ? '#2a2218' : '#1a1410';
      ctx.fillRect(0, y, left, 1);
      ctx.fillRect(right, y, pw - right, 1);
    }
    fillEllipse(pw * 0.56, ph * 0.12, pw * 0.26, ph * 0.2, '#f3edd4');
    fillEllipse(pw * 0.56, ph * 0.16, pw * 0.12, ph * 0.1, '#fff8e8');
    ctx.fillStyle = '#120e0c';
    ctx.fillRect(0, 0, pw, Math.round(ph * 0.05));
    fang(pw * 0.16, 0, ph * 0.24, pw * 0.06, '#3a2c24');
    fang(pw * 0.3, 0, ph * 0.16, pw * 0.04, '#2a2018');
    fang(pw * 0.7, 0, ph * 0.2, pw * 0.05, '#3a2c24');
    fang(pw * 0.84, 0, ph * 0.3, pw * 0.07, '#241812');
    const water = Math.round(ph * 0.48);
    band(water, ph, '#d8fff4', '#062820');
    const sway = Math.sin(now / 500) * 3;
    ctx.fillStyle = 'rgba(255,252,230,0.28)';
    for (let i = 0; i < Math.round(ph * 0.34); i++) {
      const ww = pw * 0.04 + i * 0.22;
      ctx.fillRect(Math.round(pw * 0.5 + sway - ww / 2), Math.round(ph * 0.2) + i, Math.max(1, Math.round(ww)), 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const ripple = Math.floor(now / 280) % 5;
    for (let x = Math.round(pw * 0.22); x < pw * 0.8; x += 6) {
      ctx.fillRect(x, water + 2 + ((x + ripple) % 8 < 4 ? 0 : 1), 3, 1);
    }
    fillEllipse(pw * 0.64, ph * 0.68, pw * 0.08, ph * 0.04, '#e4e0d0');
    fillEllipse(pw * 0.64, ph * 0.72, pw * 0.09, ph * 0.02, '#5a5448');
    ctx.fillStyle = '#241c16';
    ctx.fillRect(0, ph - 14, Math.round(pw * 0.28), 14);
    ledge();
  }
  function drawDeep(now) {
    band(0, ph * 0.22, '#7ec8f0', '#1a6498');
    band(ph * 0.22, ph, '#145888', '#040c16');
    const shift = Math.sin(now / 900) * pw * 0.02;
    ctx.fillStyle = 'rgba(220, 240, 255, 0.2)';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(Math.round(pw * (0.38 + i * 0.06) + shift), 0, Math.max(2, Math.round(pw * 0.012)), Math.round(ph * 0.78));
    }
    for (let y = 0; y < ph; y++) {
      const open = 0.22 + Math.sin(y * 0.03) * 0.04;
      const left = Math.round(pw * (0.5 - open) + Math.sin(y * 0.16) * 4);
      const right = Math.round(pw * (0.5 + open) + Math.sin(y * 0.12 + 1) * 4);
      ctx.fillStyle = y % 10 < 2 ? '#101820' : '#1c2c3a';
      ctx.fillRect(0, y, left, 1);
      ctx.fillStyle = y % 8 < 2 ? '#0c141c' : '#162430';
      ctx.fillRect(right, y, pw - right, 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    const bubble = Math.floor(now / 160) % Math.max(1, Math.round(ph));
    ctx.fillRect(Math.round(pw * 0.48), (ph - bubble) % ph, 2, 2);
    ctx.fillRect(Math.round(pw * 0.55), (Math.round(ph * 0.7) - bubble) % ph, 1, 1);
    ledge();
  }
  function ridge(base, amp, color, seed) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, ph);
    for (let x = 0; x <= pw; x += 2) {
      const y = base + Math.sin(x * 0.05 + seed) * amp + Math.sin(x * 0.13 + seed * 2) * amp * 0.45;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(pw, ph);
    ctx.fill();
  }
  function drawRiver(now) {
    band(0, ph * 0.34, '#d7f0fb', '#8eb6d4');
    ridge(ph * 0.2, ph * 0.04, '#b7c6d4', 1);
    ridge(ph * 0.3, ph * 0.05, '#7f9468', 2.2);
    ridge(ph * 0.4, ph * 0.045, '#2f6a38', 4);
    ctx.fillStyle = '#245832';
    for (let x = 4; x < pw; x += 9) {
      const y = ph * 0.36 + Math.sin(x * 0.2) * 3;
      ctx.fillRect(x, Math.round(y), 2, 5);
      ctx.fillRect(x - 2, Math.round(y) + 2, 6, 2);
    }
    const surface = Math.round(ph * 0.46);
    band(surface, ph * 0.8, '#c9e6ea', '#1d5a52');
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    const flow = Math.floor(now / 220) % 8;
    for (let x = 8; x < pw - 8; x += 7) {
      ctx.fillRect(x, surface + 2 + ((x + flow) % 10 < 5 ? 0 : 1), 3, 1);
    }
    ctx.fillStyle = '#8a8478';
    [[0.22, 0.58], [0.48, 0.66], [0.7, 0.6]].forEach(([nx, ny], i) => {
      ctx.fillRect(Math.round(pw * nx), Math.round(ph * ny), 4 + i, 2);
    });
    ctx.fillStyle = '#cbb892';
    ctx.fillRect(0, Math.round(ph * 0.78), pw, Math.round(ph * 0.08));
    ctx.fillStyle = '#3d7a3a';
    ctx.fillRect(0, ph - 12, pw, 12);
    ctx.fillStyle = '#2a5a28';
    for (let x = 0; x < pw; x += 4) ctx.fillRect(x, ph - 12, 2, 2);
    ctx.fillStyle = '#6a4a30';
    ctx.fillRect(pw - 8, ph - 16, 3, 8);
  }
  function coral(x, y, kind) {
    const u = Math.max(3, pw * 0.035);
    if (kind === 0) {
      fillEllipse(x, y, u * 2.2, u * 1.3, '#2f8a55');
      fillEllipse(x, y - u * 0.7, u * 1.4, u, '#67b86a');
      fillEllipse(x - u, y + u * 0.3, u * 0.8, u * 0.7, '#d8c06a');
    } else if (kind === 1) {
      ctx.fillStyle = '#e08a78';
      ctx.fillRect(Math.round(x), Math.round(y - u * 3.2), Math.max(2, Math.round(u * 0.45)), Math.round(u * 3.4));
      ctx.fillRect(Math.round(x - u * 1.1), Math.round(y - u * 2.4), Math.max(2, Math.round(u * 0.4)), Math.round(u * 2.4));
      ctx.fillRect(Math.round(x + u), Math.round(y - u * 2.6), Math.max(2, Math.round(u * 0.4)), Math.round(u * 2.6));
      ctx.fillStyle = '#f2d0c4';
      ctx.fillRect(Math.round(x), Math.round(y - u * 3.2), Math.max(2, Math.round(u * 0.45)), Math.round(u * 0.5));
    } else {
      fillEllipse(x, y, u * 2.6, u * 0.8, '#7a4a78');
      fillEllipse(x, y - u * 0.45, u * 1.8, u * 0.55, '#c06088');
    }
  }
  function drawShore(now) {
    band(0, ph * 0.18, '#c8f2ff', '#4eb0e0');
    band(ph * 0.18, ph, '#2a8ec4', '#0c4e86');
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    const sway = Math.sin(now / 800) * pw * 0.015;
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(Math.round(pw * (0.08 + i * 0.18) + sway), 0, Math.max(2, Math.round(pw * 0.012)), Math.round(ph * 0.62));
    }
    fillEllipse(pw * 0.28, ph * 0.9, pw * 0.22, ph * 0.07, '#e6d2a4');
    fillEllipse(pw * 0.7, ph * 0.92, pw * 0.2, ph * 0.06, '#d8c498');
    coral(pw * 0.18, ph * 0.72, 0);
    coral(pw * 0.36, ph * 0.66, 1);
    coral(pw * 0.52, ph * 0.74, 2);
    coral(pw * 0.68, ph * 0.62, 0);
    coral(pw * 0.82, ph * 0.7, 1);
    coral(pw * 0.28, ph * 0.84, 2);
    coral(pw * 0.58, ph * 0.86, 0);
    ledge();
  }
  function scenePicture(id) {
    const src = SCENE_ART[id];
    if (!src) return null;
    if (!sceneImages[id]) {
      const img = new Image();
      img.src = src;
      sceneImages[id] = img;
    }
    const img = sceneImages[id];
    return img.complete && img.naturalWidth ? img : null;
  }
  function coverOf(img) {
    const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    return { scale, ox: (pw - dw) / 2, oy: (ph - dh) / 2, dw, dh };
  }
  function zoneRect(img, zone) {
    const c = coverOf(img);
    return {
      x: c.ox + zone.x * c.dw,
      y: c.oy + zone.y * c.dh,
      w: zone.w * c.dw,
      h: zone.h * c.dh,
    };
  }
  function mainWaterPoint() {
    const zones = WATER[Pond.sceneId];
    const img = scenePicture(Pond.sceneId);
    if (!zones || !img) return null;
    const zone = zones.slice().sort((a, b) => (b.w * b.h) - (a.w * a.h))[0];
    const rect = zoneRect(img, zone);
    return { x: rect.x + rect.w * 0.5, y: rect.y + rect.h * 0.45 };
  }
  function pickCast() {
    const zones = WATER[Pond.sceneId];
    const img = scenePicture(Pond.sceneId);
    const fallback = { nx: 0.48, ny: 0.66 };
    if (!zones || !img) return fallback;
    const area = zones.reduce((sum, zone) => sum + zone.w * zone.h, 0);
    for (let n = 0; n < 8; n++) {
      let pick = Math.random() * area;
      let zone = zones[0];
      for (let i = 0; i < zones.length; i++) {
        pick -= zones[i].w * zones[i].h;
        if (pick <= 0) { zone = zones[i]; break; }
      }
      const ix = zone.x + Math.random() * zone.w;
      const iy = zone.y + Math.random() * zone.h;
      const c = coverOf(img);
      const nx = (c.ox + ix * c.dw) / pw;
      const ny = (c.oy + iy * c.dh) / ph;
      if (nx > 0.08 && nx < 0.86 && ny > 0.1 && ny < 0.9) return { nx, ny };
    }
    const aim = mainWaterPoint();
    return aim ? { nx: aim.x / pw, ny: aim.y / ph } : fallback;
  }
  function clipZones(rects) {
    ctx.beginPath();
    rects.forEach((rect) => ctx.rect(rect.x, rect.y, rect.w, rect.h));
    ctx.clip();
  }
  function drawRiverFx(img, now) {
    const rects = WATER.river.map((zone) => zoneRect(img, zone));
    ctx.save();
    clipZones(rects);
    const flow = (now / 1400) % 1;
    ctx.strokeStyle = 'rgba(236, 252, 255, 0.45)';
    ctx.lineWidth = Math.max(1, dot);
    for (let i = 0; i < 9; i++) {
      const rect = rects[i % rects.length];
      const x = rect.x + ((i * 0.23) % 1) * rect.w;
      const y = rect.y + ((flow + i * 0.17) % 1) * rect.h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 8 * dot, y + 3 * dot, x + 16 * dot, y + 7 * dot);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawDeepFx(img, now) {
    const shaft = zoneRect(img, WATER.deep[0]);
    ctx.save();
    const glow = 0.05 + 0.05 * Math.sin(now / 800);
    ctx.fillStyle = `rgba(186, 224, 255, ${glow})`;
    for (let i = 0; i < 4; i++) {
      const sway = Math.sin(now / 900 + i) * 3 * dot;
      ctx.fillRect(shaft.x + shaft.w * (0.18 + i * 0.18) + sway, shaft.y, Math.max(2, dot * 1.5), shaft.h);
    }
    for (let i = 0; i < 8; i++) {
      const phase = (now / (1600 + i * 220) + i * 0.13) % 1;
      const x = shaft.x + shaft.w * (0.25 + (i % 4) * 0.16) + Math.sin(now / 480 + i) * 5 * dot;
      const y = shaft.y + shaft.h * (1 - phase);
      ctx.fillStyle = `rgba(226, 244, 255, ${0.2 + 0.45 * (1 - phase)})`;
      ctx.beginPath();
      ctx.arc(x, y, (1 + (i % 3)) * dot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawCaveFx(img, now) {
    const rects = WATER.cave.map((zone) => zoneRect(img, zone));
    ctx.save();
    clipZones(rects);
    const pool = rects[rects.length - 1];
    const pulse = 0.08 + 0.06 * Math.sin(now / 900);
    ctx.fillStyle = `rgba(255, 236, 186, ${pulse})`;
    ctx.beginPath();
    ctx.ellipse(pool.x + pool.w * 0.45, pool.y + pool.h * 0.4, pool.w * 0.28, pool.h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(210, 255, 236, 0.4)';
    ctx.lineWidth = Math.max(1, dot);
    const drift = (now / 1600) % 1;
    for (let i = 0; i < 6; i++) {
      const rect = rects[i % rects.length];
      const y = rect.y + ((drift + i * 0.19) % 1) * rect.h;
      const x = rect.x + rect.w * 0.12;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + rect.w * 0.35, y - 2 * dot, x + rect.w * 0.7, y);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawShoreFx(img, now) {
    const rects = WATER.shore.map((zone) => zoneRect(img, zone));
    ctx.save();
    clipZones(rects);
    ctx.strokeStyle = 'rgba(190, 236, 255, 0.28)';
    ctx.lineWidth = Math.max(1, dot);
    const wave = (now / 1800) % 1;
    rects.forEach((rect, index) => {
      for (let i = 0; i < 3; i++) {
        const y = rect.y + ((wave + index * 0.2 + i * 0.28) % 1) * rect.h;
        ctx.beginPath();
        ctx.moveTo(rect.x, y);
        ctx.quadraticCurveTo(rect.x + rect.w * 0.5, y + Math.sin(now / 500 + i) * 3 * dot, rect.x + rect.w, y);
        ctx.stroke();
      }
    });
    for (let i = 0; i < 7; i++) {
      const rect = rects[i % rects.length];
      const blink = 0.5 + 0.5 * Math.sin(now / 280 + i * 1.7);
      if (blink < 0.45) continue;
      const x = rect.x + ((i * 0.37) % 1) * rect.w;
      const y = rect.y + ((i * 0.53) % 1) * rect.h;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + blink * 0.4})`;
      ctx.fillRect(x, y, dot, dot * 3);
      ctx.fillRect(x - dot, y + dot, dot * 3, dot);
    }
    ctx.restore();
  }
  function drawBlueFx(img, now) {
    const hole = zoneRect(img, WATER.blue[0]);
    const cx = hole.x + hole.w / 2;
    const cy = hole.y + hole.h / 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(120, 210, 255, 0.45)';
    ctx.lineWidth = Math.max(1, dot);
    for (let i = 0; i < 3; i++) {
      const phase = (now / 2200 + i / 3) % 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, hole.w * (0.2 + phase * 0.7), hole.h * (0.2 + phase * 0.7), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawSceneFx(img, now) {
    if (Pond.sceneId === 'river') drawRiverFx(img, now);
    else if (Pond.sceneId === 'deep') drawDeepFx(img, now);
    else if (Pond.sceneId === 'cave') drawCaveFx(img, now);
    else if (Pond.sceneId === 'shore') drawShoreFx(img, now);
    else if (Pond.sceneId === 'blue') drawBlueFx(img, now);
  }
  function drawCover(img) {
    const c = coverOf(img);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, c.ox, c.oy, c.dw, c.dh);
    ctx.imageSmoothingEnabled = false;
  }
  function drawScene(now) {
    const picture = scenePicture(Pond.sceneId);
    if (picture) {
      drawCover(picture);
      drawSceneFx(picture, now);
      return;
    }
    if (Pond.sceneId === 'blue') drawBlue(now);
    else if (Pond.sceneId === 'cave') drawCave(now);
    else if (Pond.sceneId === 'deep') drawDeep(now);
    else if (Pond.sceneId === 'river') drawRiver(now);
    else drawShore(now);
  }

  function drawRod(now) {
    const pose = rodTip();
    const bob = bobber && Pond.mode !== 'idle' ? bobberXY(now) : null;
    if (bob && Pond.mode !== 'casting') plotLine(pose.tip.x, pose.tip.y, bob.x, bob.y - 3, '#1a120c');
    plotLine(pose.base.x, pose.base.y, pose.tip.x, pose.tip.y, '#c08848');
    plotLine(pose.base.x + 1, pose.base.y, pose.tip.x + 1, pose.tip.y, '#8a5a30');
    ctx.fillStyle = '#d04545';
    ctx.fillRect(pose.tip.x - dot, pose.tip.y - dot, 3 * dot, 3 * dot);
    if (bob && Pond.mode !== 'casting') drawBobber(bob.x, bob.y);
    else if (Pond.mode === 'casting' && bobber) {
      const p = clamp(1 - (modeUntil - now) / 620, 0, 1);
      const targetX = bobber.nx * pw;
      const targetY = bobber.ny * ph;
      const x = pose.tip.x + (targetX - pose.tip.x) * p;
      const y = pose.tip.y + (targetY - pose.tip.y) * p - Math.sin(p * Math.PI) * ph * 0.25;
      drawBobber(x, y);
    } else drawBobber(pose.base.x - 6, pose.base.y - 2);
  }

  function render(now) {
    drawScene(now);
    particles.forEach((p) => {
      const k = 1 - p.age / p.life;
      if (k <= 0) return;
      if (p.type === 'ring') {
        ctx.fillStyle = `rgba(255,255,255,${0.7 * k})`;
        const r = 2 + Math.floor(p.age * 10);
        ctx.fillRect(Math.round(p.x - r), Math.round(p.y), dot, dot);
        ctx.fillRect(Math.round(p.x + r), Math.round(p.y), dot, dot);
      } else {
        ctx.fillStyle = '#f4f7fb';
        ctx.fillRect(Math.round(p.x), Math.round(p.y), dot, dot);
      }
    });
    drawRod(now);
  }

  function renderPortrait() {
    if (!cardEl.classList.contains('show') || !pending) return;
    const look = scene();
    portraitCtx.fillStyle = look.mid;
    portraitCtx.fillRect(0, 0, portrait.width, portrait.height);
    if (drawPhoto(portraitCtx, pending.id, portrait.width / 2, portrait.height / 2, portrait.width - 8, portrait.height - 8)) return;
    portraitCtx.imageSmoothingEnabled = false;
    portraitCtx.fillStyle = look.deep;
    portraitCtx.fillRect(0, 30, portrait.width, 26);
    blit(portraitCtx, pending, 90, 52, 2, false, false);
  }

  function splash(nx, ny) {
    particles.push({ type: 'ring', x: nx * pw, y: ny * ph, age: 0, life: 0.8 });
    for (let i = 0; i < 5; i++) {
      particles.push({
        type: 'drop',
        x: nx * pw,
        y: ny * ph,
        vx: (Math.random() - 0.5) * 20,
        vy: -10 - Math.random() * 16,
        age: 0,
        life: 0.45,
      });
    }
  }

  function cast() {
    if (!mapOpen(Pond.sceneId)) {
      setHint('这块地图还没打开。');
      return;
    }
    if (Pond.mode !== 'idle' && Pond.mode !== 'escaping') return;
    closeBook();
    pending = rollLoot();
    pendingJin = pickJin(pending);
    pendingNew = !Pond.album.counts[pending.id];
    bobber = pickCast();
    visitor = null;
    Pond.mode = 'casting';
    modeUntil = performance.now() + 620;
    setHint(pick(['线出去了。', '就这样，先放到水里。']));
    playCast();
    syncAction();
  }
  function beginWait(now) {
    Pond.mode = 'waiting';
    const waitMs = (8 + Math.random() * 12) * 1000;
    waitUntil = now + waitMs;
    approachAt = waitUntil - 2100;
    splash(bobber.nx, bobber.ny);
    setHint(pick(WAIT_HINTS));
    syncAction();
  }
  function beginBite(now) {
    Pond.mode = 'biting';
    biteUntil = now + 12000;
    setHint(pending.rarity === 'junk' ? '浮漂沉下去了。' : '鱼咬钩了。');
    playBite();
    syncAction();
    emit('bite');
  }
  function commitCatch() {
    const item = pending;
    const album = Pond.album;
    album.counts[item.id] = (album.counts[item.id] || 0) + 1;
    album.stock[item.id] = (album.stock[item.id] || 0) + 1;
    if (item.jin) {
      album.best[item.id] = Math.max(album.best[item.id] || 0, pendingJin);
      const today = dateKey(new Date());
      if (album.day !== today) {
        album.day = today;
        album.todayFish = 0;
      }
      album.todayFish += 1;
    }
    album.pity = item.rarity === 'legendary' ? 0 : album.pity + 1;
    refreshDex();
    emit('change');
  }
  function showCard() {
    const item = pending;
    cardEl.classList.add('show');
    document.getElementById('card-fresh').hidden = !pendingNew;
    const rarity = document.getElementById('card-rarity');
    rarity.dataset.r = item.rarity;
    rarity.textContent = RARITY_NAME[item.rarity];
    document.getElementById('card-name').textContent = item.name;
    const best = Pond.album.best[item.id];
    const price = FISH_PRICE[item.rarity] || 8;
    document.getElementById('card-meta').textContent = item.jin
      ? `${formatJin(pendingJin)}${best ? ` · 最大 ${formatJin(best)}` : ''} · 可卖 ${price} 金`
      : `可卖 ${price} 金`;
    const about = (window.Sprites && Sprites.about(item.id)) || (item.where ? { where: item.where, water: item.water, size: item.size } : null);
    const intro = (window.Sprites && Sprites.intro(item.id)) || item.line;
    document.getElementById('card-line').textContent = about
      ? `分布：${about.where}。${about.water}，常见体长 ${about.size}。${intro}`
      : intro;
    clearTimeout(cardTimer);
    if (Pond.auto) cardTimer = setTimeout(collect, 3400);
    syncAction();
    emit('catch', { name: item.name, line: item.line, meta: document.getElementById('card-meta').textContent, isNew: pendingNew });
  }
  function hook() {
    if (Pond.mode !== 'biting') return;
    biteFlag.classList.remove('on');
    Pond.mode = 'leaping';
    modeUntil = performance.now() + (pending.rarity === 'junk' ? 520 : 880);
    splash(bobber.nx, bobber.ny);
    commitCatch();
    playCatch(pending);
    syncAction();
  }
  function miss() {
    biteFlag.classList.remove('on');
    Pond.mode = 'escaping';
    modeUntil = performance.now() + 1200;
    if (visitor) visitor.flee = true;
    if (bobber) splash(bobber.nx, bobber.ny);
    setHint(pick(MISS_HINTS));
    playMiss();
    syncAction();
    emit('miss');
  }
  function collect() {
    if (!cardEl.classList.contains('show')) return;
    clearTimeout(cardTimer);
    cardEl.classList.remove('show');
    bobber = null;
    visitor = null;
    pending = null;
    Pond.mode = 'idle';
    setHint(Pond.auto ? '收下了，线又抛出去了。' : pick(IDLE_HINTS));
    syncAction();
    emit('settled');
    if (Pond.auto) cast();
  }
  function cancelLine() {
    if (Pond.mode !== 'waiting' && Pond.mode !== 'biting') return;
    bobber = null;
    visitor = null;
    pending = null;
    Pond.mode = 'idle';
    biteFlag.classList.remove('on');
    setHint('收起来了。');
    syncAction();
  }
  function closeBook() {
    bookEl.classList.remove('show');
    bookEl.innerHTML = '';
  }
  function fishPicture(item) {
    const photo = photoOf(item.id);
    if (photo) return photo.src;
    const big = document.createElement('canvas');
    big.width = 440;
    big.height = 280;
    const bg = big.getContext('2d');
    bg.imageSmoothingEnabled = false;
    bg.fillStyle = '#12343a';
    bg.fillRect(0, 0, big.width, big.height);
    blit(bg, item, 220, 150, 3, false, false);
    return big.toDataURL('image/png');
  }
  function openFishCard(item) {
    if (typeof window.openInspect !== 'function') return;
    const count = Pond.album.counts[item.id] || 0;
    const stock = Pond.album.stock[item.id] || 0;
    const best = Pond.album.best[item.id];
    const weight = item.jin && best ? `最大 ${formatJin(best)} · ` : '';
    const price = FISH_PRICE[item.rarity] || 8;
    const photo = photoOf(item.id);
    const about = (window.Sprites && Sprites.about(item.id)) || (item.where ? { where: item.where, water: item.water, size: item.size } : null);
    window.openInspect({
      src: fishPicture(item),
      alt: item.name,
      locked: count === 0,
      back: item.name,
      fill(copy) {
        const head = document.createElement('div');
        head.textContent = `${item.name}　${RARITY_NAME[item.rarity]}　${weight}钓到 ${count} 次 · 手头 ${stock}`;
        copy.append(head);
        if (about) {
          const place = document.createElement('div');
          place.textContent = `分布：${about.where}`;
          const body = document.createElement('div');
          body.textContent = `水域：${about.water}　常见体长：${about.size}`;
          copy.append(place, body);
        }
        const blurb = document.createElement('div');
        blurb.textContent = (window.Sprites && Sprites.intro(item.id)) || item.line;
        copy.append(blurb);
        const note = document.createElement('div');
        note.className = 'photo-credit';
        note.textContent = photo ? `照片：${photo.credit}` : (item.rarity === 'junk' ? '' : '没有对应的野外照片，上面是示意。');
        if (note.textContent) copy.append(note);
        const sell = document.createElement('button');
        sell.type = 'button';
        sell.textContent = stock > 0 ? `卖掉一条 · ${price} 金` : '没有可卖的';
        sell.disabled = stock <= 0;
        sell.addEventListener('click', () => {
          if (!Pond.sell(item.id)) return;
          openFishCard(item);
        });
        copy.append(sell);
      },
    });
  }
  function openBook() {
    const fishCount = Object.entries(Pond.album.counts).reduce((sum, [id, n]) => {
      const item = LOOT.find((entry) => entry.id === id);
      return sum + (item && item.jin ? n : 0);
    }, 0);
    const found = LOOT.filter((item) => Pond.album.counts[item.id]).length;
    bookEl.innerHTML = `<div class="book-head"><div>鱼册 ${found}/${LOOT.length} · ${fishCount} 尾</div><button type="button" id="book-close">×</button></div><div class="grid" id="book-grid"></div>`;
    const grid = document.getElementById('book-grid');
    const addCell = (item) => {
      const count = Pond.album.counts[item.id] || 0;
      const cell = document.createElement('div');
      cell.className = 'cell' + (count ? '' : ' locked');
      const photo = photoOf(item.id);
      let thumb;
      if (photo) {
        thumb = document.createElement('img');
        thumb.className = 'fish-photo';
        thumb.alt = item.name;
        thumb.src = photo.src;
      } else {
        thumb = document.createElement('canvas');
        thumb.width = 96;
        thumb.height = 64;
        const g = thumb.getContext('2d');
        g.imageSmoothingEnabled = false;
        blit(g, item, 48, 34, 1, false, !count);
      }
      cell.addEventListener('click', () => openFishCard(item));
      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = item.name;
      const meta = document.createElement('div');
      meta.className = 'count';
      meta.textContent = count ? `${count}` : RARITY_NAME[item.rarity];
      cell.append(thumb, name, meta);
      grid.append(cell);
    };
    SCENES.forEach((sceneItem) => {
      const items = LOOT.filter((item) => item.rarity !== 'junk' && item.scenes.includes(sceneItem.id));
      const got = items.filter((item) => Pond.album.counts[item.id]).length;
      const label = document.createElement('div');
      label.className = 'region-label';
      label.textContent = `${sceneItem.name}　${got}/${items.length}`;
      grid.append(label);
      items.forEach(addCell);
    });
    const junk = LOOT.filter((item) => item.rarity === 'junk');
    const junkLabel = document.createElement('div');
    junkLabel.className = 'region-label';
    junkLabel.textContent = '杂物';
    grid.append(junkLabel);
    junk.forEach(addCell);
    document.getElementById('book-close').addEventListener('click', closeBook);
    bookEl.classList.add('show');
  }

  function steer(dt, tx, ty) {
    const dx = tx - visitor.nx;
    const dy = ty - visitor.ny;
    visitor.dir = dx >= 0 ? 1 : -1;
    const dist = Math.hypot(dx, dy) || 0.001;
    const step = Math.min(dist, dt * 0.35);
    visitor.nx += (dx / dist) * step;
    visitor.ny += (dy / dist) * step;
  }

  function update(dt, now) {
    ambient.forEach((fish) => {
      fish.nx += fish.dir * fish.speed * dt;
      if (fish.nx > 1.1) fish.dir = -1;
      if (fish.nx < -0.1) fish.dir = 1;
    });
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.type === 'drop') {
        p.vy += 40 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      if (p.age >= p.life) particles.splice(i, 1);
    }
    if (Pond.mode === 'casting' && now >= modeUntil) beginWait(now);
    if (Pond.mode === 'waiting') {
      if (!visitor && pending && pending.rarity !== 'junk' && now >= approachAt) {
        visitor = { nx: Math.random() < 0.5 ? -0.05 : 1.05, ny: 0.7, dir: 1 };
      }
      if (visitor && bobber) steer(dt, bobber.nx, bobber.ny + 0.08);
      if (now >= waitUntil) beginBite(now);
    }
    if (Pond.mode === 'biting') {
      if (visitor && bobber) steer(dt, bobber.nx, Math.min(0.86, bobber.ny + 0.12));
      if (now >= biteUntil) miss();
    }
    if (Pond.mode === 'leaping' && now >= modeUntil) {
      visitor = null;
      showCard();
      Pond.mode = 'showing';
      syncAction();
    }
    if (Pond.mode === 'escaping') {
      if (visitor) {
        visitor.nx += (visitor.dir || 1) * 0.6 * dt;
        visitor.ny = Math.min(0.9, visitor.ny + dt * 0.2);
      }
      if (now >= modeUntil) {
        visitor = null;
        bobber = null;
        pending = null;
        Pond.mode = 'idle';
        syncAction();
        if (Pond.auto) cast();
        else setHint(pick(IDLE_HINTS));
      }
    }
  }

  function loop(now) {
    const dt = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;
    measure();
    update(dt, now);
    if (canvas.width > 2) {
      render(now);
      renderPortrait();
    }
    requestAnimationFrame(loop);
  }

  function renderScenes() {
    scenesEl.innerHTML = '';
    SCENES.forEach((item) => {
      const open = mapOpen(item.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = open ? item.name : `${item.name} ${mapCost(item.id)}`;
      button.title = open ? item.name : `${item.name}，${mapCost(item.id)} 金解锁`;
      button.classList.toggle('on', item.id === Pond.sceneId);
      button.classList.toggle('locked', !open);
      button.addEventListener('click', () => {
        if (!open) {
          buyMap(item);
          return;
        }
        if (Pond.sceneId === item.id) return;
        if (Pond.mode !== 'idle' && Pond.mode !== 'showing') {
          setHint('先把这一竿处理完。');
          return;
        }
        Pond.sceneId = item.id;
        spawnAmbient();
        renderScenes();
        emit('change');
      });
      scenesEl.append(button);
    });
  }

  Pond.bind = (hooks) => { Pond.hooks = hooks || {}; };
  Pond.cast = cast;
  Pond.hook = hook;
  Pond.collect = collect;
  Pond.cancel = cancelLine;
  Pond.primary = () => {
    if (Pond.mode === 'biting') hook();
    else if (cardEl.classList.contains('show')) collect();
    else if (bookEl.classList.contains('show')) closeBook();
    else if (Pond.mode === 'waiting' || Pond.mode === 'biting') cancelLine();
    else if (Pond.mode === 'idle') cast();
  };
  Pond.price = (item) => FISH_PRICE[item.rarity] || 8;
  Pond.sell = (id) => {
    const item = LOOT.find((entry) => entry.id === id);
    const album = Pond.album;
    if (!item || !(album.stock[id] > 0) || !window.Farm) return 0;
    album.stock[id] -= 1;
    if (album.stock[id] <= 0) delete album.stock[id];
    const price = Pond.price(item);
    Farm.gain(price);
    emit('change');
    return price;
  };
  Pond.payload = () => ({
    counts: Pond.album.counts,
    best: Pond.album.best,
    stock: Pond.album.stock,
    todayFish: Pond.album.todayFish,
    day: Pond.album.day,
    pity: Pond.album.pity,
    auto: Pond.auto,
    sound: Pond.sound,
    scene: Pond.sceneId,
    maps: openMaps.slice(),
  });
  Pond.load = (save) => {
    const album = Pond.album;
    album.counts = save.counts && typeof save.counts === 'object' ? save.counts : {};
    album.best = save.best && typeof save.best === 'object' ? save.best : {};
    if (save.stock && typeof save.stock === 'object') {
      album.stock = {};
      Object.keys(save.stock).forEach((id) => {
        const n = Number(save.stock[id]) || 0;
        if (n > 0) album.stock[id] = n;
      });
    } else {
      album.stock = { ...album.counts };
    }
    album.pity = Number(save.pity) || 0;
    album.day = save.day || dateKey(new Date());
    album.todayFish = album.day === dateKey(new Date()) ? (Number(save.todayFish) || 0) : 0;
    if (album.day !== dateKey(new Date())) album.day = dateKey(new Date());
    Pond.auto = !!save.auto;
    Pond.sound = save.sound !== false;
    openMaps = ['blue'];
    if (Array.isArray(save.maps)) {
      save.maps.forEach((id) => {
        if (SCENES.some((item) => item.id === id) && !openMaps.includes(id)) openMaps.push(id);
      });
    }
    const savedScene = SCENE_ALIAS[save.scene] || save.scene;
    if (SCENES.some((item) => item.id === savedScene) && mapOpen(savedScene)) Pond.sceneId = savedScene;
    else Pond.sceneId = 'blue';
    document.getElementById('btn-auto').classList.toggle('on', Pond.auto);
    document.getElementById('btn-sound').classList.toggle('on', Pond.sound);
    refreshDex();
    renderScenes();
    spawnAmbient();
    syncAction();
  };
  Pond.blip = () => tone(523, 0.12, 0.04);
  Pond.dismiss = () => {
    if (cardEl.classList.contains('show')) collect();
    else if (bookEl.classList.contains('show')) closeBook();
    else if (Pond.mode === 'waiting') cancelLine();
  };

  frame.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (Pond.mode === 'idle') cast();
    else if (Pond.mode === 'biting') hook();
    else if (Pond.mode === 'waiting') setHint('还没咬。再等一下，或者收竿。');
  });
  actionEl.addEventListener('click', () => {
    if (Pond.mode === 'biting') hook();
    else if (Pond.mode === 'waiting') cancelLine();
    else if (Pond.mode === 'idle') cast();
  });
  document.getElementById('card-ok').addEventListener('click', collect);
  document.getElementById('btn-book').addEventListener('click', () => {
    if (bookEl.classList.contains('show')) closeBook();
    else openBook();
  });
  document.getElementById('btn-auto').addEventListener('click', (event) => {
    Pond.auto = !Pond.auto;
    event.currentTarget.classList.toggle('on', Pond.auto);
    if (!Pond.auto) clearTimeout(cardTimer);
    setHint(Pond.auto ? '连钓开着。错过了会自己再抛。' : hintEl.textContent);
    emit('change');
  });
  document.getElementById('btn-sound').addEventListener('click', (event) => {
    Pond.sound = !Pond.sound;
    event.currentTarget.classList.toggle('on', Pond.sound);
    emit('change');
  });

  spawnAmbient();
  renderScenes();
  syncAction();
  requestAnimationFrame(loop);
})();

window.Pond = Pond;
