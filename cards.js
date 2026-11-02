'use strict';

const PACK_PRICE = 80;
const PACK_SIZE = 5;
const SET_ID = 'tide-1';
const CARD_RATES = [
  { id: '普通', p: 0.62 },
  { id: '稀有', p: 0.26 },
  { id: '史诗', p: 0.09 },
  { id: '传说', p: 0.03 },
];
const RARITY_KEY = { '普通': 'common', '稀有': 'rare', '史诗': 'epic', '传说': 'legend' };
const PACK_CARDS = (window.TIDE1 && TIDE1.cards) || [];
const SET_NAME = (window.TIDE1 && TIDE1.setName) || '退潮';
const CARD_BACK = (window.TIDE1 && TIDE1.cardBack) || null;

const Cards = {
  counts: {},
  opened: 0,
  hand: [],
  flipped: [],
  busy: false,
  album: false,
  albumWide: false,

  load(data) {
    this.counts = {};
    this.opened = 0;
    this.hand = [];
    this.flipped = [];
    if (data && data.set === SET_ID) {
      this.opened = Number(data.opened) || 0;
      PACK_CARDS.forEach((card) => {
        const n = Number(data.counts && data.counts[card.id]) || 0;
        if (n > 0) this.counts[card.id] = n;
      });
    }
    this.paint();
  },

  payload() {
    return { set: SET_ID, counts: { ...this.counts }, opened: this.opened };
  },

  paint() {
    const owned = document.getElementById('pack-owned');
    const found = PACK_CARDS.filter((card) => this.counts[card.id]).length;
    if (owned) owned.textContent = `${found}/${PACK_CARDS.length}`;
    const hint = document.getElementById('pack-hint');
    if (hint && !this.hand.length && !this.album) {
      hint.textContent = `第一弹 · ${SET_NAME}。一包五张，${PACK_PRICE} 金。每一张单独算，没有保底。拆过 ${this.opened} 包。`;
    }
    if (this.album) this.showAlbum();
  },
};

function rollRarity() {
  const roll = Math.random();
  let acc = 0;
  for (let i = 0; i < CARD_RATES.length; i++) {
    acc += CARD_RATES[i].p;
    if (roll < acc) return CARD_RATES[i].id;
  }
  return '普通';
}

function rollCard() {
  const rarity = rollRarity();
  const pool = PACK_CARDS.filter((card) => card.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] || PACK_CARDS[0];
}

function isHigh(card) {
  return card && (card.rarity === '史诗' || card.rarity === '传说');
}

function flavorOf(card) {
  return (card.lines || []).join('');
}

function foilKind(card) {
  if (!card) return '';
  if (card.rarity === '稀有') return 'holo';
  if (card.rarity === '史诗') return 'epic';
  if (card.rarity === '传说') return 'legend';
  return '';
}
function wrapFoil(img, card) {
  const kind = foilKind(card);
  if (!kind) return img;
  const wrap = document.createElement('span');
  wrap.className = `foil ${kind}`;
  wrap.append(img);
  return wrap;
}
function makeFace(card, faceDown) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tc' + (faceDown ? ' down' : '');
  button.dataset.r = RARITY_KEY[card.rarity] || 'common';
  if (faceDown) {
    if (CARD_BACK) {
      const img = document.createElement('img');
      img.className = 'flat';
      img.alt = '退潮卡背';
      img.src = CARD_BACK.file;
      button.append(img);
    } else {
      button.innerHTML = '<span class="seal-mark">潮</span><small>第一弹</small>';
    }
    return button;
  }
  const img = document.createElement('img');
  img.className = 'flat';
  img.alt = `${card.name}，${card.rarity}`;
  img.src = card.flat;
  const name = document.createElement('b');
  name.textContent = card.name;
  const rarity = document.createElement('small');
  rarity.textContent = card.rarity;
  button.append(wrapFoil(img, card), name, rarity);
  return button;
}

function showHand() {
  const stage = document.getElementById('pack-stage');
  if (!stage) return;
  stage.replaceChildren();
  Cards.hand.forEach((card, index) => {
    const face = makeFace(card, !Cards.flipped[index]);
    face.addEventListener('click', () => flipOne(index));
    stage.append(face);
  });
  if (Cards.flipped.some((open) => !open)) {
    const all = document.createElement('button');
    all.type = 'button';
    all.textContent = '一次撕开';
    all.addEventListener('click', flipAll);
    stage.append(all);
  }
}

function showCardLarge(card, wide, locked, fromPack) {
  if (!card || typeof window.openInspect !== 'function') return;
  const useWide = !fromPack && (wide === true || (wide !== false && isHigh(card)));
  const isLocked = !!locked;
  window.openInspect({
    src: useWide ? card.painting : card.flat,
    alt: useWide ? `${card.name}阔画` : `${card.name}平卡`,
    locked: isLocked,
    back: '退潮卡背',
    backSrc: CARD_BACK ? (useWide ? CARD_BACK.painting : CARD_BACK.file) : '',
    backTurn: !!useWide,
    foil: foilKind(card),
    fill(copy) {
      const head = document.createElement('div');
      head.textContent = isLocked
        ? `${card.id} · ${card.name} · ${card.rarity} · 未解锁`
        : `${card.id} · ${card.name} · ${card.rarity}`;
      const blurb = document.createElement('div');
      blurb.textContent = isLocked ? '还没抽到。' : flavorOf(card);
      copy.append(head, blurb);
      if (fromPack || !useWide) return;
      const swap = document.createElement('button');
      swap.type = 'button';
      swap.textContent = '看平卡';
      swap.addEventListener('click', () => showCardLarge(card, false, isLocked));
      copy.append(swap);
    },
  });
}

function flipOne(index) {
  const card = Cards.hand[index];
  if (!Cards.flipped[index]) {
    Cards.flipped[index] = true;
    showHand();
  }
  const hint = document.getElementById('pack-hint');
  if (hint && card) hint.textContent = `${card.name} · ${card.rarity}。${flavorOf(card)}`;
  showCardLarge(card, false, false, true);
}

function flipAll() {
  Cards.flipped = Cards.hand.map(() => true);
  showHand();
  const hint = document.getElementById('pack-hint');
  if (hint) hint.textContent = '这一包撕完了。点一张看立体大图，可以拖着转。';
  if (Cards.hand.length) showCardLarge(Cards.hand[0], false, false, true);
}

function buyPack() {
  if (Cards.busy || !PACK_CARDS.length) return;
  if (!window.Farm || !Farm.trySpend(PACK_PRICE)) {
    const hint = document.getElementById('pack-hint');
    if (hint) hint.textContent = `金子不够。一包 ${PACK_PRICE} 金，卖掉鱼或菜再来。`;
    return;
  }
  Cards.album = false;
  Cards.busy = true;
  const pulled = [];
  for (let i = 0; i < PACK_SIZE; i++) pulled.push(rollCard());
  pulled.forEach((card) => {
    Cards.counts[card.id] = (Cards.counts[card.id] || 0) + 1;
  });
  Cards.opened += 1;
  Cards.hand = pulled;
  Cards.flipped = pulled.map(() => false);
  Cards.paint();
  const stage = document.getElementById('pack-stage');
  stage.replaceChildren();
  const seal = document.createElement('div');
  seal.className = 'seal';
  seal.textContent = `第一弹 · ${SET_NAME}`;
  stage.append(seal);
  stage.classList.add('tearing');
  const hint = document.getElementById('pack-hint');
  if (hint) hint.textContent = '封纸裂开了。点一张，或者一次撕开。';
  setTimeout(() => {
    stage.classList.remove('tearing');
    Cards.busy = false;
    showHand();
    if (typeof queueSave === 'function') queueSave();
  }, 420);
}

Cards.showAlbum = function showAlbum() {
  const stage = document.getElementById('pack-stage');
  if (!stage) return;
  stage.classList.remove('tearing');
  stage.replaceChildren();
  const bar = document.createElement('div');
  bar.className = 'pack-row';
  const flatBtn = document.createElement('button');
  flatBtn.type = 'button';
  flatBtn.textContent = '平卡';
  flatBtn.className = Cards.albumWide ? '' : 'on';
  const wideBtn = document.createElement('button');
  wideBtn.type = 'button';
  wideBtn.textContent = '阔画';
  wideBtn.className = Cards.albumWide ? 'on' : '';
  flatBtn.addEventListener('click', () => {
    Cards.albumWide = false;
    Cards.showAlbum();
  });
  wideBtn.addEventListener('click', () => {
    Cards.albumWide = true;
    Cards.showAlbum();
  });
  bar.append(flatBtn, wideBtn);
  stage.append(bar);
  const hint = document.getElementById('pack-hint');
  if (hint) {
    hint.textContent = Cards.albumWide
      ? `第一弹 · ${SET_NAME}。史诗和传说的阔画。点一张展开。`
      : `第一弹 · ${SET_NAME}。五十张平卡。没抽到的是灰的。`;
  }
  const grid = document.createElement('div');
  grid.className = Cards.albumWide ? 'album-grid wide-grid' : 'album-grid';
  const list = Cards.albumWide ? PACK_CARDS.filter(isHigh) : PACK_CARDS;
  list.forEach((card) => {
    const owned = Cards.counts[card.id] || 0;
    const face = document.createElement('button');
    face.type = 'button';
    face.className = 'tc' + (owned ? '' : ' locked');
    face.dataset.r = RARITY_KEY[card.rarity] || 'common';
    const img = document.createElement('img');
    img.alt = `${card.name}，${card.rarity}`;
    if (Cards.albumWide) {
      img.className = 'wide';
      img.src = card.painting;
    } else {
      img.className = 'flat';
      img.src = card.flat;
    }
    const name = document.createElement('b');
    name.textContent = card.name;
    const rarity = document.createElement('small');
    rarity.textContent = owned ? `${card.rarity} ×${owned}` : card.rarity;
    face.append(wrapFoil(img, card), name, rarity);
    face.addEventListener('click', () => {
      const line = document.getElementById('pack-hint');
      if (line) line.textContent = owned
        ? `${card.id} · ${card.name} · ${card.rarity} · ${owned} 张。${flavorOf(card)}`
        : `${card.name} · ${card.rarity}。还没抽到。`;
      showCardLarge(card, Cards.albumWide, !owned);
    });
    grid.append(face);
  });
  stage.append(grid);
};

function bindCards() {
  const buy = document.getElementById('pack-buy');
  const album = document.getElementById('pack-album');
  if (!buy || buy.dataset.bound) return;
  buy.dataset.bound = '1';
  buy.addEventListener('click', buyPack);
  album.addEventListener('click', () => {
    Cards.album = !Cards.album;
    Cards.hand = [];
    if (typeof window.closeInspect === 'function') window.closeInspect();
    if (Cards.album) Cards.showAlbum();
    else {
      document.getElementById('pack-stage').replaceChildren();
      Cards.paint();
    }
  });
  Cards.paint();
}

bindCards();
window.Cards = Cards;
