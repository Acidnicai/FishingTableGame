'use strict';

const YI = ['喝水', '早点保存', '把句子写短', '站起来', '少看一眼消息', '先做最小的那件'];

const widget = document.getElementById('widget');
const drag = document.getElementById('drag');
const subEl = document.getElementById('sub');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const toastAct = document.getElementById('toast-act');
const tabPlay = document.getElementById('tab-play');
const PLAY_TABS = ['farm', 'fish', 'dino'];
const floaterK = document.getElementById('floater-k');
const floaterT = document.getElementById('floater-t');

const api = window.pond || {
  load: async () => JSON.parse(localStorage.getItem('pond-save') || '{}'),
  save: (data) => localStorage.setItem('pond-save', JSON.stringify(data)),
  saveSync: (data) => localStorage.setItem('pond-save', JSON.stringify(data)),
  setTop() {},
  setOpacity() {},
  setCompact() {},
  setIgnore() {},
  moveBy() {},
  close() {},
  ready() {},
  getTheme: async () => matchMedia('(prefers-color-scheme: dark)').matches,
  onTheme() {},
};

const settings = {
  top: true,
  opacity: 1,
  compact: false,
  tab: 'cal',
  workStart: '09:00',
  workEnd: '18:00',
};
const notes = {};
const tasks = {};
let water = 0;
let waterDay = '';
let tab = 'cal';
let calCursor = new Date();
let selected = new Date();
let weekCursor = mondayOf(new Date());
let saveTimer = 0;
let allowSave = false;
let ignoring = false;
let stretchLeft = 0;
let stretchTimer = 0;
let toastGen = 0;

function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function weekdayName(d) {
  return '日一二三四五六'[d.getDay()];
}
function minutesOf(hhmm) {
  const [h, m] = String(hhmm || '00:00').split(':').map((n) => Number(n) || 0);
  return h * 60 + m;
}
function pad(n) { return String(n).padStart(2, '0'); }
function formatRemain(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
function workSpan(now) {
  const start = minutesOf(settings.workStart);
  const end = minutesOf(settings.workEnd);
  const cur = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  return { start, end, cur, remain: (end - cur) * 60 * 1000 };
}
function yiOf(d) {
  const key = dateKey(d);
  let n = 0;
  for (let i = 0; i < key.length; i++) n += key.charCodeAt(i);
  return YI[n % YI.length];
}
function payload() {
  return {
    ...Pond.payload(),
    top: settings.top,
    opacity: settings.opacity,
    compact: settings.compact,
    tab,
    notes,
    tasks,
    water,
    waterDay,
    workStart: settings.workStart,
    workEnd: settings.workEnd,
    farm: Farm.payload(),
    cards: Cards.payload(),
    dinoBest: Dino.best,
  };
}
function queueSave() {
  if (!allowSave) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => api.save(payload()), 180);
}

function drawLogo() {
  const paint = (canvas) => {
    if (!canvas) return;
    const g = canvas.getContext('2d');
    g.clearRect(0, 0, 16, 16);
    g.fillStyle = '#6aaa38';
    g.fillRect(4, 1, 3, 3);
    g.fillRect(8, 2, 4, 3);
    g.fillRect(6, 4, 2, 3);
    g.fillStyle = '#f4e2b0';
    g.fillRect(6, 7, 4, 7);
    g.fillStyle = '#d8c090';
    g.fillRect(6, 9, 1, 1);
    g.fillRect(8, 11, 1, 1);
  };
  paint(document.getElementById('logo'));
  paint(document.getElementById('sign'));
}
function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  drawLogo();
}

function showTab(next) {
  if (next === 'play') next = PLAY_TABS.includes(tab) ? tab : 'fish';
  tab = next;
  const inPlay = PLAY_TABS.includes(next);
  document.querySelectorAll('.tabs button').forEach((button) => {
    button.classList.toggle('on', button.dataset.tab === next || (inPlay && button.dataset.tab === 'play'));
  });
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('on', view.id === `view-${next}`);
  });
  const playTabs = document.getElementById('play-tabs');
  if (playTabs) {
    playTabs.hidden = !inPlay;
    playTabs.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('on', button.dataset.play === next);
    });
  }
  if (next === 'fish') toast.hidden = true;
  if (next === 'farm') {
    Farm.catchUp();
    Farm.paint();
  }
  if (window.Dino) Dino.setActive(next === 'dino');
  syncAlert();
  queueSave();
}

function syncAlert() {
  const biting = Pond.mode === 'biting';
  tabPlay.classList.toggle('alert', biting && tab !== 'fish' && !settings.compact);
  widget.classList.toggle('alert', biting && settings.compact);
  renderClock();
}

function showToast(text, act, onAct) {
  const gen = ++toastGen;
  toast.hidden = false;
  toastText.textContent = text;
  toastAct.textContent = act;
  toastAct.onclick = onAct;
  return gen;
}
function hideToast(gen) {
  if (typeof gen === 'number' && gen !== toastGen) return;
  toast.hidden = true;
}

function renderClock() {
  const now = new Date();
  const today = dateKey(now);
  if (waterDay !== today) {
    waterDay = today;
    water = 0;
    renderDrops();
    queueSave();
  }
  const weekend = now.getDay() === 0 || now.getDay() === 6;
  const span = workSpan(now);
  let phrase = '已经下班';
  let remain = span.remain;
  if (weekend) phrase = '周末';
  else if (span.cur < span.start) {
    phrase = '还没上班';
    remain = (span.start - span.cur) * 60 * 1000;
  } else if (span.cur < span.end) phrase = `下班 ${formatRemain(remain)}`;
  subEl.textContent = `${now.getMonth() + 1}/${now.getDate()} 周${weekdayName(now)}  ${phrase}`;

  const clock = document.getElementById('clock');
  if (weekend) clock.textContent = '周末';
  else if (span.cur >= span.end) clock.textContent = '到点了';
  else if (span.cur < span.start) clock.textContent = `距上班 ${formatRemain((span.start - span.cur) * 60 * 1000)}`;
  else clock.textContent = formatRemain(remain);

  const ratio = weekend ? 1 : Math.max(0, Math.min(1, (span.cur - span.start) / Math.max(1, span.end - span.start)));
  document.getElementById('work-bar').style.width = `${Math.round(ratio * 100)}%`;
  document.getElementById('work-label').textContent = weekend
    ? '今天不用搬'
    : span.cur >= span.end
      ? '今天的进度满了'
      : span.cur < span.start
        ? '还没开始'
        : `已走过 ${Math.round(ratio * 100)}%`;

  const toSat = (6 - now.getDay() + 7) % 7;
  document.getElementById('weekend').textContent = toSat === 0 ? '正在周末' : toSat === 1 ? '明天就周六' : `还有 ${toSat} 天`;

  if (Pond.mode === 'biting') {
    floaterK.textContent = '咬钩';
    floaterT.textContent = '提竿';
  } else if (weekend) {
    floaterK.textContent = '周末';
    floaterT.textContent = '休息';
  } else if (span.cur >= span.end) {
    floaterK.textContent = '下班';
    floaterT.textContent = '到了';
  } else {
    floaterK.textContent = span.cur < span.start ? '上班' : '还有';
    floaterT.textContent = formatRemain(span.cur < span.start ? (span.start - span.cur) * 60 * 1000 : remain);
  }
  if (window.Farm && Farm.catchUp()) {
    queueSave();
    if (tab === 'farm') Farm.paint();
  }
}

function renderGrid() {
  const title = document.getElementById('cal-title');
  const grid = document.getElementById('cal-grid');
  const y = calCursor.getFullYear();
  const m = calCursor.getMonth();
  title.textContent = `${y}年${m + 1}月`;
  const first = new Date(y, m, 1);
  const pad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  grid.innerHTML = '';
  for (let i = 0; i < pad; i++) {
    const cell = document.createElement('div');
    cell.className = 'day empty';
    grid.append(cell);
  }
  for (let day = 1; day <= days; day++) {
    const date = new Date(y, m, day);
    const key = dateKey(date);
    const cell = document.createElement('div');
    cell.className = 'day';
    if (sameDay(date, today)) cell.classList.add('today');
    if (sameDay(date, selected)) cell.classList.add('sel');
    cell.textContent = String(day);
    if ((notes[key] && notes[key].trim()) || (tasks[key] && tasks[key].length)) {
      const dot = document.createElement('i');
      dot.className = 'dot';
      cell.append(dot);
    }
    cell.addEventListener('click', () => {
      selected = date;
      renderGrid();
      renderNote();
    });
    grid.append(cell);
  }
}
function renderNote() {
  const key = dateKey(selected);
  const label = document.getElementById('note-label');
  const extra = sameDay(selected, new Date()) ? ` · 宜${yiOf(selected)}` : '';
  label.textContent = `${selected.getMonth() + 1}月${selected.getDate()}日 周${weekdayName(selected)}${extra}`;
  document.getElementById('note-input').value = notes[key] || '';
}

function renderWeek() {
  const title = document.getElementById('week-title');
  const list = document.getElementById('week-list');
  const start = weekCursor;
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  title.textContent = `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`;
  list.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = dateKey(date);
    const block = document.createElement('div');
    block.className = 'day-block';
    const items = tasks[key] || [];
    const done = items.filter((item) => item.done).length;
    block.innerHTML = `<div class="day-h"><span>周${weekdayName(date)} ${date.getDate()}</span><span>${items.length ? `${done}/${items.length}` : ''}</span></div>`;
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'task' + (item.done ? ' done' : '');
      const check = document.createElement('button');
      check.type = 'button';
      check.className = 'check' + (item.done ? ' on' : '');
      check.addEventListener('click', () => {
        item.done = !item.done;
        renderWeek();
        renderGrid();
        queueSave();
      });
      const text = document.createElement('span');
      text.textContent = item.text;
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = '×';
      del.addEventListener('click', () => {
        tasks[key] = items.filter((entry) => entry.id !== item.id);
        if (!tasks[key].length) delete tasks[key];
        renderWeek();
        renderGrid();
        queueSave();
      });
      row.append(check, text, del);
      block.append(row);
    });
    const add = document.createElement('div');
    add.className = 'task-add';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 40;
    input.placeholder = '加一件';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '+';
    const commit = () => {
      const text = input.value.trim();
      if (!text) return;
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push({ id: Math.random().toString(36).slice(2, 8), text, done: false });
      renderWeek();
      renderGrid();
      queueSave();
    };
    button.addEventListener('click', commit);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        commit();
      }
    });
    add.append(input, button);
    block.append(add);
    list.append(block);
  }
}

function renderDrops() {
  const box = document.getElementById('drops');
  box.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const drop = document.createElement('i');
    if (i < water) drop.className = 'on';
    box.append(drop);
  }
  const count = document.getElementById('water-count');
  if (count) count.textContent = water > 0 ? `已喝 ${water} 口` : '还没喝';
}

function setCompact(on) {
  settings.compact = on;
  widget.classList.toggle('compact', on);
  document.body.classList.toggle('compact', on);
  api.setCompact(on);
  syncAlert();
  renderClock();
  queueSave();
}

function pointInWidget(x, y) {
  const rect = widget.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
function updateHit(event) {
  const over = pointInWidget(event.clientX, event.clientY);
  if (over === !ignoring) return;
  ignoring = !over;
  api.setIgnore(!over);
}

function applySave(save) {
  Object.assign(notes, save.notes && typeof save.notes === 'object' ? save.notes : {});
  Object.assign(tasks, save.tasks && typeof save.tasks === 'object' ? save.tasks : {});
  settings.top = save.top !== false;
  settings.opacity = Math.min(1, Math.max(0.55, Number(save.opacity) || 1));
  settings.compact = !!save.compact;
  settings.workStart = save.workStart || '09:00';
  settings.workEnd = save.workEnd || '18:00';
  waterDay = save.waterDay || dateKey(new Date());
  water = waterDay === dateKey(new Date()) ? (Number(save.water) || 0) : 0;
  tab = ['cal', 'week', 'farm', 'fish', 'dino', 'tool'].includes(save.tab) ? save.tab : 'cal';
  document.getElementById('btn-top').classList.toggle('on', settings.top);
  document.getElementById('work-start').value = settings.workStart;
  document.getElementById('work-end').value = settings.workEnd;
  document.getElementById('opacity').value = String(Math.round(settings.opacity * 100));
  api.setTop(settings.top);
  api.setOpacity(settings.opacity);
  Pond.load(save || {});
  Farm.load(save.farm);
  Cards.load(save.cards);
  Dino.load(save.dinoBest);
  if (settings.compact) setCompact(true);
  showTab(tab);
  renderGrid();
  renderNote();
  renderWeek();
  renderDrops();
  renderClock();
}

document.getElementById('cal-weekdays').textContent = '';
['一', '二', '三', '四', '五', '六', '日'].forEach((name) => {
  const cell = document.createElement('div');
  cell.textContent = name;
  document.getElementById('cal-weekdays').append(cell);
});

document.querySelectorAll('.tabs button').forEach((button) => {
  button.addEventListener('click', () => showTab(button.dataset.tab));
});
document.querySelectorAll('#play-tabs button').forEach((button) => {
  button.addEventListener('click', () => showTab(button.dataset.play));
});
document.getElementById('cal-prev').addEventListener('click', () => {
  calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() - 1, 1);
  renderGrid();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + 1, 1);
  renderGrid();
});
document.getElementById('note-input').addEventListener('input', (event) => {
  const key = dateKey(selected);
  const text = event.target.value.trim();
  if (text) notes[key] = event.target.value;
  else delete notes[key];
  renderGrid();
  queueSave();
});
document.getElementById('week-prev').addEventListener('click', () => {
  weekCursor.setDate(weekCursor.getDate() - 7);
  renderWeek();
});
document.getElementById('week-next').addEventListener('click', () => {
  weekCursor.setDate(weekCursor.getDate() + 7);
  renderWeek();
});
document.getElementById('btn-top').addEventListener('click', (event) => {
  settings.top = !settings.top;
  event.currentTarget.classList.toggle('on', settings.top);
  api.setTop(settings.top);
  queueSave();
});
document.getElementById('btn-mini').addEventListener('click', () => setCompact(true));
document.getElementById('btn-pack').addEventListener('click', () => Farm.togglePack());
document.getElementById('pack-close').addEventListener('click', () => {
  const box = document.getElementById('pack');
  if (box) box.hidden = true;
});
document.getElementById('btn-close').addEventListener('click', () => {
  try { api.saveSync(payload()); } catch (error) { console.error(error); }
  api.close();
});
document.getElementById('floater').addEventListener('click', () => {
  if (dragMoved) {
    dragMoved = false;
    return;
  }
  if (Pond.mode === 'biting') {
    setCompact(false);
    showTab('fish');
    Pond.hook();
    return;
  }
  setCompact(false);
});
document.getElementById('water-add').addEventListener('click', () => {
  water += 1;
  waterDay = dateKey(new Date());
  renderDrops();
  queueSave();
});
document.getElementById('stretch').addEventListener('click', () => {
  if (stretchLeft > 0) return;
  stretchLeft = 20;
  document.getElementById('stretch-tip').textContent = '20';
  clearInterval(stretchTimer);
  stretchTimer = setInterval(() => {
    stretchLeft -= 1;
    if (stretchLeft <= 0) {
      clearInterval(stretchTimer);
      document.getElementById('stretch-tip').textContent = '眼睛歇过了';
      Pond.blip();
      return;
    }
    document.getElementById('stretch-tip').textContent = String(stretchLeft);
  }, 1000);
});
document.getElementById('work-start').addEventListener('change', (event) => {
  settings.workStart = event.target.value || '09:00';
  renderClock();
  queueSave();
});
document.getElementById('work-end').addEventListener('change', (event) => {
  settings.workEnd = event.target.value || '18:00';
  renderClock();
  queueSave();
});
document.getElementById('opacity').addEventListener('input', (event) => {
  settings.opacity = Number(event.target.value) / 100;
  api.setOpacity(settings.opacity);
  queueSave();
});

let dragOrigin = null;
let dragMoved = false;
function bindDrag(el) {
  el.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (el === drag && event.target.closest('button')) return;
    el.setPointerCapture(event.pointerId);
    dragOrigin = { x: event.screenX, y: event.screenY, el };
    dragMoved = false;
    ignoring = false;
    api.setIgnore(false);
  });
  el.addEventListener('pointermove', (event) => {
    if (!dragOrigin || dragOrigin.el !== el) return;
    const dx = event.screenX - dragOrigin.x;
    const dy = event.screenY - dragOrigin.y;
    if (!dx && !dy) return;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    dragOrigin = { x: event.screenX, y: event.screenY, el };
    api.moveBy(dx, dy);
  });
  el.addEventListener('pointerup', () => {
    if (!dragOrigin || dragOrigin.el !== el) return;
    dragOrigin = null;
    if (dragMoved) queueSave();
  });
  el.addEventListener('pointercancel', () => {
    if (dragOrigin && dragOrigin.el === el) dragOrigin = null;
  });
}
bindDrag(drag);
bindDrag(document.getElementById('floater'));

let poseX = 14;
let poseY = -28;
let spinning = false;
let poseDrag = null;
function layoutSideBack() {
  const back = document.getElementById('inspect-back');
  const img = document.getElementById('inspect-back-img');
  if (!back || !img) return;
  if (!back.classList.contains('sideways') || img.hidden) {
    img.style.position = '';
    img.style.top = '';
    img.style.left = '';
    img.style.width = '';
    img.style.height = '';
    img.style.maxWidth = '';
    img.style.maxHeight = '';
    img.style.transform = '';
    img.style.objectFit = '';
    return;
  }
  const w = back.clientWidth;
  const h = back.clientHeight;
  if (!w || !h) return;
  img.style.position = 'absolute';
  img.style.top = '50%';
  img.style.left = '50%';
  img.style.width = `${h}px`;
  img.style.height = `${w}px`;
  img.style.maxWidth = 'none';
  img.style.maxHeight = 'none';
  img.style.objectFit = 'cover';
  img.style.transform = 'translate(-50%, -50%) rotate(90deg)';
}
function fitInspectCard() {
  const front = document.getElementById('inspect-img');
  const card = document.getElementById('inspect-card');
  const frame = document.getElementById('inspect-frame');
  if (!front || !card || !frame || !front.naturalWidth) return;
  const roomW = frame.clientWidth > 20 ? frame.clientWidth - 8 : 360;
  const roomH = frame.clientHeight > 20 ? frame.clientHeight - 8 : 420;
  const maxW = Math.max(140, Math.min(roomW, 400));
  const maxH = Math.max(160, Math.min(roomH, 460));
  const scale = Math.min(maxW / front.naturalWidth, maxH / front.naturalHeight);
  card.style.width = `${Math.round(front.naturalWidth * scale)}px`;
  card.style.height = `${Math.round(front.naturalHeight * scale)}px`;
  layoutSideBack();
}
function whenImageReady(image, fn) {
  if (!image || image.hidden) return;
  if (image.complete && image.naturalWidth) fn();
  else image.addEventListener('load', fn, { once: true });
}
function applyInspectPose() {
  const card = document.getElementById('inspect-card');
  const btn = document.getElementById('inspect-rot');
  if (!card) return;
  card.classList.toggle('spin', spinning);
  card.style.transform = spinning ? '' : `rotateX(${poseX}deg) rotateY(${poseY}deg)`;
  if (btn) btn.textContent = spinning ? '停下' : '旋转';
}
function closeInspect() {
  const box = document.getElementById('inspect');
  if (box) box.hidden = true;
  spinning = false;
  poseDrag = null;
}
function openInspect(opts) {
  const box = document.getElementById('inspect');
  const img = document.getElementById('inspect-img');
  const copy = document.getElementById('inspect-copy');
  const card = document.getElementById('inspect-card');
  const lock = document.getElementById('inspect-lock');
  const backImg = document.getElementById('inspect-back-img');
  const backLabel = document.getElementById('inspect-back-label');
  const backFace = document.getElementById('inspect-back');
  if (!box || !img || !card) return;
  spinning = false;
  poseDrag = null;
  poseX = 14;
  poseY = -28;
  img.alt = opts.alt || '';
  img.src = opts.src || '';
  const foil = document.getElementById('inspect-foil');
  if (foil) {
    foil.className = opts.foil ? `foil ${opts.foil}` : '';
    foil.hidden = !opts.foil;
  }
  card.classList.toggle('locked', !!opts.locked);
  if (lock) lock.hidden = !opts.locked;
  if (backImg && backLabel) {
    if (opts.backSrc) {
      backImg.hidden = false;
      backImg.alt = opts.back || '卡背';
      backImg.src = opts.backSrc;
      backLabel.hidden = true;
    } else {
      backImg.hidden = true;
      backImg.removeAttribute('src');
      backLabel.hidden = false;
      backLabel.textContent = opts.back || '工位';
    }
  }
  if (backFace) backFace.classList.toggle('sideways', !!opts.backTurn);
  applyInspectPose();
  copy.replaceChildren();
  if (typeof opts.fill === 'function') opts.fill(copy);
  box.hidden = false;
  fitInspectCard();
  whenImageReady(img, fitInspectCard);
  whenImageReady(backImg, fitInspectCard);
}
window.openInspect = openInspect;
window.closeInspect = closeInspect;
document.getElementById('inspect-rot').addEventListener('click', () => {
  spinning = !spinning;
  applyInspectPose();
});
document.getElementById('inspect-close').addEventListener('click', closeInspect);
const inspectFrame = document.getElementById('inspect-frame');
inspectFrame.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  spinning = false;
  applyInspectPose();
  inspectFrame.setPointerCapture(event.pointerId);
  poseDrag = { x: event.clientX, y: event.clientY, poseX, poseY };
});
inspectFrame.addEventListener('pointermove', (event) => {
  if (!poseDrag) return;
  poseY = poseDrag.poseY + (event.clientX - poseDrag.x) * 0.55;
  poseX = Math.max(-55, Math.min(55, poseDrag.poseX - (event.clientY - poseDrag.y) * 0.4));
  applyInspectPose();
});
inspectFrame.addEventListener('pointerup', () => { poseDrag = null; });
inspectFrame.addEventListener('pointercancel', () => { poseDrag = null; });
document.addEventListener('pointermove', updateHit);
document.addEventListener('mousemove', updateHit);

window.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowDown' && tab === 'dino') Dino.duck(false);
});
window.addEventListener('keydown', (event) => {
  if (event.target.closest('input, textarea')) return;
  if (event.code === 'Escape') {
    const inspect = document.getElementById('inspect');
    const pack = document.getElementById('pack');
    if (inspect && !inspect.hidden) closeInspect();
    else if (pack && !pack.hidden) Farm.togglePack();
    else if (!toast.hidden && Pond.mode !== 'biting') hideToast();
    else if (tab === 'fish') Pond.dismiss();
    return;
  }
  if (event.code === 'KeyB') {
    event.preventDefault();
    Farm.togglePack();
    return;
  }
  const packOpen = document.getElementById('pack') && !document.getElementById('pack').hidden;
  if (packOpen) {
    if ((event.code === 'Space' || event.code === 'Enter') && !toast.hidden && Pond.mode === 'biting') {
      event.preventDefault();
      Pond.hook();
    }
    return;
  }
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    if (!toast.hidden && Pond.mode === 'biting') Pond.hook();
    else if (tab === 'dino') Dino.jump();
    else if (tab === 'farm') Farm.useHere();
    else if (tab === 'fish') Pond.primary();
  } else if ((event.code === 'ArrowDown' || event.code === 'ArrowUp') && tab === 'dino') {
    event.preventDefault();
    if (event.code === 'ArrowDown') Dino.duck(true);
    else Dino.jump();
  } else if (tab === 'farm' && /^Key[WASD]$/.test(event.code)) {
    event.preventDefault();
    if (event.shiftKey && (event.code === 'KeyW' || event.code === 'KeyS')) Farm.zoomBy(event.code === 'KeyW' ? 1 : -1);
    else if (event.code === 'KeyW') Farm.pan(0, -1);
    else if (event.code === 'KeyS') Farm.pan(0, 1);
    else if (event.code === 'KeyA') Farm.pan(-1, 0);
    else Farm.pan(1, 0);
  } else if (tab === 'farm' && !event.repeat) {
    const tools = { Digit1: 'hoe', Digit2: 'water', Digit3: 'harvest', Digit4: 'shovel', Numpad1: 'hoe', Numpad2: 'water', Numpad3: 'harvest', Numpad4: 'shovel' };
    if (tools[event.code]) {
      event.preventDefault();
      Farm.pickTool(tools[event.code]);
    } else if (event.code === 'KeyQ' || event.code === 'KeyE') {
      event.preventDefault();
      Farm.cycleSeed(event.code === 'KeyQ' ? -1 : 1);
    } else if (event.code === 'KeyR') {
      event.preventDefault();
      Farm.useField();
    }
  }
});
document.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('beforeunload', () => api.saveSync(payload()));

Pond.bind({
  change: queueSave,
  mode: syncAlert,
  bite() {
    syncAlert();
    if (tab !== 'fish' && !settings.compact) {
      showToast('鱼咬钩了', '提竿', () => Pond.hook());
    }
  },
  catch(info) {
    syncAlert();
    if (tab === 'fish' || settings.compact) return;
    const fresh = info.isNew ? '新收录 · ' : '';
    showToast(`${fresh}${info.name} ${info.meta}`, '收下', () => {
      Pond.collect();
      hideToast();
    });
  },
  miss() {
    syncAlert();
    if (tab === 'fish') return;
    const gen = showToast('跑了，塘还在', '好', hideToast);
    setTimeout(() => hideToast(gen), 2200);
  },
  settled() {
    if (Pond.mode === 'idle' || Pond.mode === 'casting') hideToast();
  },
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => applyTheme(event.matches));
if (api.onTheme) api.onTheme(applyTheme);
drawLogo();
setInterval(renderClock, 1000);

(async function start() {
  try {
    const save = await api.load();
    if (api.getTheme) applyTheme(await api.getTheme());
    applySave(save || {});
  } catch (error) {
    console.error(error);
  }
  allowSave = true;
  queueSave();
  api.ready();
})();
