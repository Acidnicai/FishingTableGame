'use strict';

const SHAPE = {
  minnow: { kind: 'fish', w: 5, h: 2, tail: 3, belly: '#f6e8c4', fin: '#c8a060' },
  crucian: { kind: 'fish', w: 8, h: 5, tail: 4, dorsal: 3, belly: '#f3ddb0', fin: '#a87840' },
  shrimp: { kind: 'shrimp', color: '#e8a0a0' },
  loach: { kind: 'fish', w: 11, h: 2, tail: 3, whisker: true, belly: '#d8c8a8', fin: '#8a7050' },
  bitter: { kind: 'fish', w: 4, h: 2, tail: 3, belly: '#f8e0d4', fin: '#e09090' },
  tilapia: { kind: 'fish', w: 7, h: 4, tail: 4, dorsal: 2, belly: '#e4ecc0', fin: '#7a9048' },
  snail: { kind: 'snail' },
  bream: { kind: 'fish', w: 8, h: 6, tail: 3, dorsal: 2, belly: '#f4f0e4', fin: '#b0a888' },
  yellow: { kind: 'fish', w: 6, h: 3, tail: 3, whisker: true, belly: '#f0e090', fin: '#c0a040' },
  catfish: { kind: 'fish', w: 12, h: 3, tail: 3, whisker: true, belly: '#c8c0a8', fin: '#5a5848' },
  carp: { kind: 'fish', w: 9, h: 4, tail: 4, dorsal: 3, belly: '#f0d0a0', fin: '#c07838' },
  grass: { kind: 'fish', w: 11, h: 4, tail: 4, dorsal: 3, belly: '#d8e8c0', fin: '#5a8848' },
  silver: { kind: 'fish', w: 9, h: 5, tail: 4, dorsal: 2, belly: '#f8f8f8', fin: '#c0c8d0' },
  goldfish: { kind: 'fish', w: 6, h: 4, tail: 7, dorsal: 2, belly: '#f8d090', fin: '#e07820' },
  gui: { kind: 'fish', w: 7, h: 4, tail: 4, dorsal: 3, mark: 'bars', markColor: '#2a4020', belly: '#d8e8c0', fin: '#4a7840' },
  snake: { kind: 'fish', w: 11, h: 3, tail: 3, dorsal: 2, belly: '#6a7058', fin: '#2a3428' },
  koi: { kind: 'fish', w: 8, h: 4, tail: 6, dorsal: 2, mark: 'spots', markColor: '#e25b4a', belly: '#fff8f0', fin: '#f0a0a0' },
  moon: { kind: 'fish', w: 6, h: 3, tail: 4, belly: '#fff8ff', fin: '#d0c0e8' },
  golden: { kind: 'fish', w: 9, h: 4, tail: 6, dorsal: 3, mark: 'spots', markColor: '#fff6d0', belly: '#ffe090', fin: '#e0a030' },
  sardine: { kind: 'fish', w: 7, h: 2, tail: 3, belly: '#f4f8fc', fin: '#a8b8c8' },
  pomfret: { kind: 'fish', w: 6, h: 6, tail: 3, dorsal: 2, belly: '#f8f4e8', fin: '#d0c8b0' },
  hairtail: { kind: 'ribbon', len: 16, belly: '#f4f7fb', fin: '#b0b8c4' },
  flounder: { kind: 'flat', w: 8, h: 4, belly: '#e8d8b0', fin: '#b09868' },
  crab: { kind: 'crab' },
  star: { kind: 'star' },
  jelly: { kind: 'jelly' },
  clown: { kind: 'fish', w: 6, h: 3, tail: 3, mark: 'bands', markColor: '#f7f4ee', belly: '#f0a030', fin: '#f0a030' },
  horse: { kind: 'horse' },
  dragon: { kind: 'ribbon', len: 14, belly: '#d8fff4', fin: '#3a9888' },
  blind: { kind: 'fish', w: 6, h: 3, tail: 3, belly: '#f4f0f4', fin: '#d0c8d0', blind: true },
  cshrimp: { kind: 'shrimp', color: '#f0d8c8' },
  bat: { kind: 'fish', w: 8, h: 3, tail: 3, dorsal: 4, belly: '#a090b0', fin: '#403050' },
  crystal: { kind: 'fish', w: 6, h: 3, tail: 4, belly: '#e8ffff', fin: '#60d0d8' },
  glow: { kind: 'jelly', color: '#c8f0a0' },
  spirit: { kind: 'fish', w: 7, h: 4, tail: 5, mark: 'spots', markColor: '#fff6ff', belly: '#f4e8ff', fin: '#c0a0e0' },
  betta: { kind: 'fish', w: 5, h: 4, tail: 8, dorsal: 4, belly: '#f0a0b0', fin: '#c03058' },
  skipper: { kind: 'fish', w: 6, h: 3, tail: 3, belly: '#d8e0b0', fin: '#708050' },
  frog: { kind: 'frog' },
  rainkoi: { kind: 'fish', w: 8, h: 4, tail: 6, mark: 'spots', markColor: '#e25b4a', belly: '#fff8f0', fin: '#f0b0b0' },
  guppy: { kind: 'fish', w: 4, h: 2, tail: 5, belly: '#ffe0a0', fin: '#f0c050' },
  angel: { kind: 'fish', w: 3, h: 7, tail: 3, dorsal: 2, belly: '#fff8ee', fin: '#e0d0b0' },
  oscar: { kind: 'fish', w: 8, h: 5, tail: 4, mark: 'spots', markColor: '#f0d080', belly: '#f0c090', fin: '#c06830' },
  pleco: { kind: 'ribbon', len: 12, belly: '#d8d0b8', fin: '#4a4030', armor: true },
  turtle: { kind: 'turtle' },
  salary: { kind: 'fish', w: 7, h: 3, tail: 3, mark: 'tie', markColor: '#d04545', belly: '#f0f4f8', fin: '#2a3858' },
  boot: { kind: 'boot' },
  can: { kind: 'can' },
  weed: { kind: 'weed' },
  note: { kind: 'note' },
  bottle: { kind: 'can', glass: true },
  lamp: { kind: 'lamp' },
  leaf: { kind: 'leaf' },
  umbrella: { kind: 'note', color: '#e07070' },
};

const INTRO = {
  minnow: '身子只有一指长，侧线清楚，嘴朝上。喜欢成群贴着岸边的浅水，一口就能吞下浮漂旁的碎屑。',
  crucian: '背青腹白，身子侧扁，鳞片又细又密。不挑水质，咬钩也老实，是池塘里最常遇见的那种。',
  shrimp: '身子透明带粉，弯成一弓，两根长须在前面探路。受惊就弹一下，尾扇张开像一小片叶子。',
  loach: '又细又滑，嘴边有短须，喜欢钻软泥。你几乎握不住它，它却会先用尾巴跟你打个招呼。',
  bitter: '小小一尾，繁殖季侧腹会闪出一点银边。胆子小，总躲在水草根上。',
  tilapia: '身子厚实，背鳍很长，鳞片带一点青灰。原本是外来的，在暖水里过得很稳。',
  snail: '壳是右旋的螺旋，腹足慢慢贴着泥走。看着不动，第二天却已经换了一块石头。',
  bream: '身子特别高，侧看像一枚竖着的银叶子。嘴小，吃藻也吃碎屑，游起来一摆一摆。',
  yellow: '背黄腹浅，胸鳍上有硬刺，嘴边拖着细须。它咬钩前会先用须探一探饵。',
  catfish: '头扁嘴宽，须很长，皮肤光滑没有鳞。白天贴底，夜里才沿着岸边慢慢巡。',
  carp: '嘴边有两对短须，鳞片大而整齐，尾鳍叉开。力气好，提竿时竿尖会先弯一下。',
  grass: '身子近圆筒，头钝，鳞片边缘发黑。专吃水草，拉起来手心会发热。',
  silver: '头小腹深，全身银白，侧线以下更亮。成群游过时，水面像被谁擦了一下。',
  goldfish: '眼大尾长，鳍又软又飘，颜色是暖的橙红。多半是从谁的鱼缸里自己游出来的。',
  gui: '嘴大，身上有不规则的暗斑，背鳍上的棘很硬。花纹整齐得像自己打扮过。',
  snake: '头扁如蛇，身上有深色斑块，腹面发白。不爱出声，咬住了就不松。',
  koi: '白底上嵌着红斑，胸鳍柔软，尾鳍拖得很长。人们把它当成好兆头，它只是在慢慢游。',
  moon: '鳞片几乎透明，边缘有一圈冷白。夜里才靠近水面，白天缩回深一点的地方。',
  golden: '通体金黄，红斑淡得像光。难得一见，提上来的时候水花也是亮的。',
  sardine: '背青腹银，身子细而侧扁，总是几十尾一起拐弯。单独一条时，它会显得有点慌。',
  pomfret: '身子极高极薄，口小，尾鳍深叉。侧面看像一块被磨亮的银板。',
  hairtail: '扁得像一条带子，银白，尾端细成一根线，嘴里有细齿。夜间贴着中层水游。',
  flounder: '两只眼睛都挤在身体朝上的一侧，贴着沙底，颜色能跟着沙子变。你差点把它看成一块泥。',
  crab: '壳近圆，两只螯一大一小，走路是横的。退潮后的浅滩上，它会举起螯警告你。',
  star: '五只腕一样长，管足在下面慢慢挪。它不追饵，是自己爬到钩边的。',
  jelly: '伞部透明，下面垂着短触手。跟着水流走，自己几乎不出力。',
  clown: '橙红的身子上有两道白边，白边再镶一圈黑。颜色很响，游得很慢。',
  horse: '头像马，尾巴卷起来挂在海草上，肚子上有育儿袋。它是直立着游的。',
  dragon: '身子细长有骨环，吻成一根管子，颜色接近海草。不游的时候，你会把它看成一根水草。',
  blind: '眼睛退化成两个小点，靠侧线认路。洞里没有光，它仍然知道石头在哪里。',
  cshrimp: '比河虾更白，触须相对更长。它沿着石缝摸，不喜欢开阔的水面。',
  bat: '胸鳍展开像翅膀，其实并不飞，只是贴着岩壁滑。身子暗，边鳍更暗。',
  crystal: '鳞片透出青白，像一小块还没干的冰。洞顶滴水的地方，它停得最久。',
  glow: '伞缘会一明一暗，把前面一小圈水照亮。它不烫手，只是亮。',
  spirit: '斑点淡得发紫，鳍边有一圈光。你放慢的时候它才从石后出来。',
  betta: '背鳍和尾鳍又长又软，展开时比身子还大。浅水、慢水、有草的地方，它才肯撑开。',
  skipper: '眼睛突出，胸鳍能当脚，退潮时爬上泥滩。嘴里含着水，所以离水也不会立刻慌。',
  frog: '皮肤光滑，趾端有吸盘，雨天趴在叶上叫。它不是鱼，是自己跳进你的抄网的。',
  rainkoi: '雨点打在水面上时，红斑看起来更深。它只在这种天气靠近岸。',
  guppy: '雄鱼尾鳍宽而花，雌鱼更素。鱼缸里最忙的一种，停不下来。',
  angel: '身子侧扁得几乎站着游，背鳍和臀鳍拉成两面旗。它排队一样，一条跟着一条。',
  oscar: '嘴大，身上的纹路像一张旧地图，会随心情变深变浅。认得常来喂食的人。',
  pleco: '嘴是吸盘，背上有一排硬甲。它贴着缸壁，专门收拾别人留下的藻。',
  turtle: '背甲有块状花纹，头上有细黄纹，脚趾有蹼。晒够了才会滑回水里。',
  salary: '身子是沉稳的深蓝，胸前一道红，像谁给它打了一条领带。它游得很准时。',
  boot: '一只泡软的草鞋，鞋带还在，人已经不在。钩子是挂在鞋耳上的。',
  can: '铝皮瘪了一块，拉环还连着。里面空了，所以特别轻。',
  weed: '一缕断掉的水草，根已经不在了。绿的，软的，不会催你。',
  note: '纸泡开了，折痕还在。能认出的句子是：今天也辛苦了。',
  bottle: '玻璃还完整，塞子不见了。里面没有信，只有一点河水。',
  lamp: '矿灯的玻璃裂了，已经不亮。有人把它带到过很深的地方。',
  leaf: '叶脉还清楚，边已经卷了。它比你先离开这棵树。',
  umbrella: '一把小纸伞，骨还撑着，纸被雨打透了。只能再挡一小会儿。',
};

function shade(hex, amt) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  if (!Number.isFinite(n)) return hex;
  const f = (c) => Math.max(0, Math.min(255, c + amt));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function paint(ctx, x, y, dx, dy, s, dirs, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x + dx * dirs * s), Math.round(y + dy * s), s, s);
}

function drawFishBody(ctx, spec, color, x, y, s, flip) {
  const dirs = flip ? 1 : -1;
  const w = spec.w;
  const h = spec.h;
  const body = color;
  const belly = spec.belly || shade(color, 40);
  const fin = spec.fin || shade(color, -30);
  const dark = shade(color, -55);
  const tail = spec.tail || 3;
  for (let i = 1; i <= tail; i++) {
    const spread = Math.max(1, Math.ceil(i * h / tail));
    paint(ctx, x, y, -w - i, 0, s, dirs, fin);
    paint(ctx, x, y, -w - i, -spread, s, dirs, fin);
    paint(ctx, x, y, -w - i, spread, s, dirs, fin);
  }
  for (let ix = -w; ix <= w; ix++) {
    for (let iy = -h; iy <= h; iy++) {
      const nx = ix / w;
      const ny = iy / h;
      const e = nx * nx + ny * ny;
      if (e > 1) continue;
      let c = e > 0.82 ? dark : (iy > Math.max(1, h * 0.2) ? belly : body);
      paint(ctx, x, y, ix, iy, s, dirs, c);
    }
  }
  const dorsal = spec.dorsal || 2;
  for (let i = 0; i < dorsal; i++) paint(ctx, x, y, -1 + i, -h - 1, s, dirs, fin);
  paint(ctx, x, y, 0, h, s, dirs, fin);
  if (!spec.blind) {
    paint(ctx, x, y, w - 1, -Math.max(1, Math.round(h * 0.35)), s, dirs, '#1a120c');
    paint(ctx, x, y, w, -Math.max(1, Math.round(h * 0.35)) - 1, s, dirs, '#fff8e8');
  } else {
    paint(ctx, x, y, w - 1, -1, s, dirs, '#f4f0f4');
  }
  if (spec.whisker) {
    paint(ctx, x, y, w, 1, s, dirs, '#3a2a18');
    paint(ctx, x, y, w + 1, 2, s, dirs, '#3a2a18');
  }
  if (spec.mark === 'spots') {
    paint(ctx, x, y, 0, 0, s, dirs, spec.markColor);
    paint(ctx, x, y, -3, 1, s, dirs, spec.markColor);
    paint(ctx, x, y, 2, -1, s, dirs, spec.markColor);
  } else if (spec.mark === 'bands') {
    for (let iy = -h + 1; iy <= h - 1; iy++) {
      paint(ctx, x, y, 1, iy, s, dirs, spec.markColor);
      paint(ctx, x, y, -2, iy, s, dirs, spec.markColor);
    }
  } else if (spec.mark === 'bars') {
    for (let k = -1; k <= 1; k++) {
      for (let iy = -h + 1; iy <= h - 1; iy++) paint(ctx, x, y, k * 2, iy, s, dirs, spec.markColor);
    }
  } else if (spec.mark === 'tie') {
    paint(ctx, x, y, 1, 0, s, dirs, spec.markColor);
    paint(ctx, x, y, 1, 1, s, dirs, spec.markColor);
    paint(ctx, x, y, 0, 2, s, dirs, spec.markColor);
    paint(ctx, x, y, 2, 2, s, dirs, spec.markColor);
  }
}

function drawSpecial(ctx, spec, color, x, y, s, flip) {
  const dirs = flip ? 1 : -1;
  const c = spec.color || color;
  const dark = shade(c, -40);
  if (spec.kind === 'ribbon') {
    const len = spec.len || 14;
    for (let i = -len; i <= 3; i++) {
      paint(ctx, x, y, i, 0, s, dirs, i > 1 ? dark : c);
      if (i > -len + 2 && i < 2) paint(ctx, x, y, i, 1, s, dirs, spec.belly || shade(c, 36));
      if (spec.armor && i % 3 === 0) paint(ctx, x, y, i, -1, s, dirs, dark);
    }
    paint(ctx, x, y, -len - 1, -1, s, dirs, spec.fin || dark);
    paint(ctx, x, y, -len - 1, 1, s, dirs, spec.fin || dark);
    paint(ctx, x, y, 2, -1, s, dirs, '#1a120c');
    return;
  }
  if (spec.kind === 'flat') {
    drawFishBody(ctx, { w: spec.w, h: spec.h, tail: 3, dorsal: 1, belly: spec.belly, fin: spec.fin, blind: true }, color, x, y, s, flip);
    paint(ctx, x, y, spec.w - 2, -spec.h + 1, s, dirs, '#1a120c');
    paint(ctx, x, y, spec.w - 4, -spec.h + 1, s, dirs, '#1a120c');
    return;
  }
  if (spec.kind === 'shrimp') {
    const cols = [3, 2, 1, 0, -1, -2, -3];
    cols.forEach((ix, i) => {
      const iy = i < 3 ? -1 : 1;
      paint(ctx, x, y, ix, iy, s, dirs, i % 2 ? dark : c);
    });
    paint(ctx, x, y, 4, -2, s, dirs, c);
    paint(ctx, x, y, 5, -3, s, dirs, c);
    paint(ctx, x, y, -4, 0, s, dirs, c);
    paint(ctx, x, y, -4, 2, s, dirs, c);
    paint(ctx, x, y, 3, -1, s, dirs, '#1a120c');
    return;
  }
  if (spec.kind === 'crab') {
    for (let ix = -2; ix <= 2; ix++) {
      for (let iy = -1; iy <= 1; iy++) paint(ctx, x, y, ix, iy, s, dirs, ix === 0 && iy === 0 ? shade(c, 20) : c);
    }
    paint(ctx, x, y, -4, -2, s, dirs, dark);
    paint(ctx, x, y, -5, -3, s, dirs, dark);
    paint(ctx, x, y, 4, -2, s, dirs, dark);
    paint(ctx, x, y, 5, -3, s, dirs, dark);
    paint(ctx, x, y, -1, -2, s, dirs, '#1a120c');
    paint(ctx, x, y, 1, -2, s, dirs, '#1a120c');
    paint(ctx, x, y, -2, 2, s, dirs, dark);
    paint(ctx, x, y, 0, 2, s, dirs, dark);
    paint(ctx, x, y, 2, 2, s, dirs, dark);
    return;
  }
  if (spec.kind === 'star') {
    const arms = ['..#.#.#..', '.#..#..#.', '..#####..', '.##.#.##.', '..#####..', '.#..#..#.', '..#...#..'];
    arms.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 4, iy - 3, s, 1, ch === '#' ? c : shade(c, 28));
      });
    });
    return;
  }
  if (spec.kind === 'jelly') {
    for (let ix = -4; ix <= 4; ix++) {
      for (let iy = -3; iy <= 1; iy++) {
        if ((ix * ix) / 16 + ((iy + 1) * (iy + 1)) / 9 <= 1) {
          paint(ctx, x, y, ix, iy, s, 1, iy < -1 ? shade(c, 36) : c);
        }
      }
    }
    [-3, -1, 1, 3].forEach((ix, n) => {
      paint(ctx, x, y, ix, 2, s, 1, shade(c, 8));
      paint(ctx, x, y, ix, 3 + (n % 2), s, 1, shade(c, 8));
    });
    paint(ctx, x, y, -2, -1, s, 1, '#1a120c');
    paint(ctx, x, y, 2, -1, s, 1, '#1a120c');
    return;
  }
  if (spec.kind === 'horse') {
    const rows = ['..##e', '..###', '...#.', '...#.', '..##.', '.##..', '##...'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 2, iy - 3, s, dirs, ch === 'e' ? '#1a120c' : (ch === '#' ? c : dark));
      });
    });
    return;
  }
  if (spec.kind === 'frog') {
    const rows = ['.e...e.', '##...##', '.#####.', '..###..', '.#...#.'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 3, iy - 2, s, 1, ch === 'e' ? '#1a120c' : c);
      });
    });
    return;
  }
  if (spec.kind === 'turtle') {
    const rows = ['..#####..', '.d#d#d#d.', '.#######.', '.d#d#d#d.', '..#####..', '#..#.#..#'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        const col = ch === '#' ? shade(c, 24) : ch === 'd' ? shade(c, -28) : c;
        paint(ctx, x, y, ix - 4, iy - 2, s, dirs, col);
      });
    });
    paint(ctx, x, y, 5, -1, s, dirs, '#1a120c');
    return;
  }
  if (spec.kind === 'snail') {
    const rows = ['.###.', '#d#d#', '#.#d#', '.###.', '..##.'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 3, iy - 2, s, dirs, ch === 'd' ? dark : c);
      });
    });
    paint(ctx, x, y, 2, 1, s, dirs, shade(c, 30));
    paint(ctx, x, y, 3, 2, s, dirs, shade(c, 30));
    return;
  }
  if (spec.kind === 'boot') {
    const rows = ['.##.', '.##.', '.##.', '####', 'dddd'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 1, iy - 2, s, dirs, ch === 'd' ? dark : c);
      });
    });
    return;
  }
  if (spec.kind === 'can') {
    const body = spec.glass ? '#9fd4e4' : '#d5dee6';
    for (let iy = -3; iy <= 3; iy++) {
      for (let ix = -1; ix <= 1; ix++) {
        paint(ctx, x, y, ix, iy, s, 1, iy === 0 ? '#d04545' : body);
      }
    }
    paint(ctx, x, y, -1, -3, s, 1, '#8a98a4');
    paint(ctx, x, y, 1, -3, s, 1, '#8a98a4');
    return;
  }
  if (spec.kind === 'lamp') {
    const rows = ['..#..', '.###.', '.w#w.', '..d..', '..d..'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        const col = ch === '#' ? '#f0d060' : ch === 'w' ? '#fff0a0' : '#6a5840';
        paint(ctx, x, y, ix - 2, iy - 2, s, 1, col);
      });
    });
    return;
  }
  if (spec.kind === 'weed') {
    const rows = ['#.#.#', '.#.#.', '#.#.#', '.#.#.', '#...#'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '#') paint(ctx, x, y, ix - 2, iy - 2, s, 1, iy % 2 ? shade(c, 18) : c);
      });
    });
    return;
  }
  if (spec.kind === 'leaf') {
    const rows = ['..##.', '.####', '##d##', '.####', '..##.'];
    rows.forEach((row, iy) => {
      [...row].forEach((ch, ix) => {
        if (ch === '.') return;
        paint(ctx, x, y, ix - 2, iy - 2, s, dirs, ch === 'd' ? shade(c, -30) : c);
      });
    });
    return;
  }
  if (spec.kind === 'note') {
    const paper = spec.color || '#f3ead7';
    for (let iy = -3; iy <= 3; iy++) {
      for (let ix = -2; ix <= 2; ix++) paint(ctx, x, y, ix, iy, s, 1, paper);
    }
    paint(ctx, x, y, -1, -1, s, 1, '#8a7058');
    paint(ctx, x, y, 0, 0, s, 1, '#8a7058');
    paint(ctx, x, y, -1, 1, s, 1, '#8a7058');
  }
}

const MASK = {
  dart: ['  ff  ', ' bbbbb', 'bllllep', ' bbbbb', '  ff  '],
  deep: ['  fff ', ' bbbbb', 'bbllllb', 'bllllep', 'bbllllb', ' bbbbb', '  fff '],
  carp: ['  ff   ', 'bbbbbbb', 'bbllllw', 'bllllep', 'bbllllb', 'bbbbbbb', '  ff   '],
  eel: ['bbbbbbbbbbbb', 'blllllllllep', 'bbbbbbbbbbbw'],
  ribbon: ['bbbbbbbbbbbbbbbb', 'blllllllllllllep', 'ff              '],
  fancy: ['fff    ', 'ffbbbb ', 'fbllsb ', 'ffbllep', 'fbllsb ', 'ffbbbb ', 'fff    '],
  spots: [' ff   ', 'bbsbb ', 'bbllsb', 'bbllep', 'bbsbb ', ' ff   '],
  bars: ['  ff ', 'bbsbb', 'bslsb', 'bsllep', 'bbsbb', '  ff '],
  betta: ['fffff  ', 'fffbbbb', 'ffblllep', 'fffbbbb', 'fffff  '],
  guppy: ['fff   ', 'ffbbb ', 'fbblep', 'ffbbb ', 'fff   '],
  angel: ['  f  ', ' bbb ', 'bbbbb', 'bblep', ' bbb ', '  f  '],
  flat: [' eepp ', 'bbbbbb', 'bllllb', 'bbbbbb', 'ff  ff'],
  shrimp: ['   bb ', '  b lb', ' b  lb', 'b   ep', ' bb   ', 'b ff  '],
  crab: ['p     p', ' bb bb ', '  bbb  ', ' bebeb ', '  bbb  ', ' b b b '],
  star: ['  b  ', 'b b b', ' bbb ', 'b b b', '  b  '],
  jelly: [' bbbb ', 'bllllb', 'bbbbbb', ' b b b', ' b b b'],
  clown: ['  bb  ', ' bwbb ', 'bbwblep', ' bwbb ', '  bb  '],
  horse: ['  bb ', ' bepb', '  bb ', '  bb ', ' bb  ', 'b    '],
  frog: ['p   p', ' bbb ', 'bbbbb', 'bb bb'],
  skipper: [' p p ', 'bbbbb', 'blllb', 'bb bb'],
  turtle: [' bbbb', 'blblb', ' bbbp', 'b b b'],
  snail: [' bbb ', 'b l b', ' bbb ', 'bbbbb'],
  bat: ['ffffff', ' bbbbp', 'ffffff'],
  salary: ['  ff ', ' bbbb', 'bbttbp', ' bbbb', '  ff '],
  boot: ['bb   ', 'bb   ', 'bbbb ', 'bbbb '],
  can: ['bbbb', 'brrb', 'bbbb', 'bbbb'],
  weed: ['b b b', ' b b ', 'b b b', ' b b '],
  note: ['bbbbb', 'blllb', 'bl llb', 'bbbbb'],
  leaf: ['  bb', ' bbb', 'bbbb', ' bb '],
  lamp: [' bb ', 'bbbb', ' blb', '  b ', '  b '],
  bottle: [' bb ', ' blb', 'bbbb', 'bbbb'],
  umbrella: ['bbbbb', 'b   b', '  b  ', '  b  '],
};

function look(mask, pal) {
  return {
    mask,
    pal: Object.assign({
      b: '#e0b060', l: '#f6e6c0', f: '#c08040', e: '#fff8ea', p: '#14110e',
      w: '#3a2a18', s: '#e25b4a', t: '#d04545', r: '#d04545',
    }, pal),
  };
}

const LOOK = {
  minnow: look('dart', { b: '#e8c868', l: '#f8e8b0', f: '#c89840' }),
  crucian: look('deep', { b: '#d89848', l: '#f0d090', f: '#b07030' }),
  shrimp: look('shrimp', { b: '#f0a0a8', l: '#f8d0d4', f: '#e08088' }),
  loach: look('eel', { b: '#a08058', l: '#d0b888', w: '#3a2a18' }),
  bitter: look('dart', { b: '#f0b0b8', l: '#f8e0e4', f: '#e09098' }),
  tilapia: look('deep', { b: '#8aaa58', l: '#d8e8b0', f: '#688840' }),
  snail: look('snail', { b: '#8a9a48', l: '#d4e090' }),
  bream: look('deep', { b: '#d0d4dc', l: '#f4f6fa', f: '#a8b0bc' }),
  yellow: look('carp', { b: '#e0c040', l: '#f8e888', f: '#c0a030', w: '#6a5018' }),
  catfish: look('eel', { b: '#6a6858', l: '#b0aa98', w: '#2a2418' }),
  carp: look('carp', { b: '#e09048', l: '#f8d0a0', f: '#c07030', w: '#5a3818' }),
  grass: look('carp', { b: '#68a858', l: '#d0e8b8', f: '#488040', w: '#3a5828' }),
  silver: look('carp', { b: '#d8e0ea', l: '#f8fafc', f: '#b0bcc8', w: '#8090a0' }),
  goldfish: look('fancy', { b: '#f09030', l: '#f8d090', f: '#e07020', s: '#ffe0a0' }),
  gui: look('bars', { b: '#78a858', l: '#d8e8c0', f: '#508040', s: '#2a4020' }),
  snake: look('eel', { b: '#3c4a38', l: '#8a9878', w: '#1a2018' }),
  koi: look('spots', { b: '#f7f3ec', l: '#fff8f4', f: '#f0b0b0', s: '#e25b4a' }),
  moon: look('fancy', { b: '#e8e0f8', l: '#f8f4ff', f: '#c8b8e8', s: '#fff6ff' }),
  golden: look('spots', { b: '#f0c040', l: '#ffe090', f: '#e0a020', s: '#fff4c0' }),
  sardine: look('dart', { b: '#7aa4c8', l: '#e8f0f8', f: '#5888a8' }),
  pomfret: look('deep', { b: '#e8e4d8', l: '#f8f6f0', f: '#c8c0b0' }),
  hairtail: look('ribbon', { b: '#d8dee8', l: '#f4f7fb', f: '#b0b8c4' }),
  flounder: look('flat', { b: '#d0b888', l: '#f0e4c8', f: '#b09868' }),
  crab: look('crab', { b: '#e06848', l: '#f0a090' }),
  star: look('star', { b: '#e88848', l: '#f8c090' }),
  jelly: look('jelly', { b: '#d8c8ec', l: '#f4eefc' }),
  clown: look('clown', { b: '#f09028', l: '#f8c070', w: '#f7f4ee' }),
  horse: look('horse', { b: '#e0a848', l: '#f8d898' }),
  dragon: look('ribbon', { b: '#3ec0b0', l: '#d8fff4', f: '#2a9888' }),
  blind: look('dart', { b: '#e4dce6', l: '#f4eef2', f: '#c8c0cc', e: '#e4dce6', p: '#d8d0da' }),
  cshrimp: look('shrimp', { b: '#f0d8c8', l: '#f8ece4', f: '#e0c0b0' }),
  bat: look('bat', { b: '#684878', l: '#c8b8d8', f: '#403050' }),
  crystal: look('dart', { b: '#58d8e0', l: '#d8ffff', f: '#30b0b8' }),
  glow: look('jelly', { b: '#a8e070', l: '#e8ffc0' }),
  spirit: look('spots', { b: '#d0b8ee', l: '#f4e8ff', f: '#b090d8', s: '#fff6ff' }),
  betta: look('betta', { b: '#e04868', l: '#f0a0b0', f: '#c02850' }),
  skipper: look('skipper', { b: '#8a9a58', l: '#d8e0b0' }),
  frog: look('frog', { b: '#58a040', l: '#b8e090' }),
  rainkoi: look('spots', { b: '#f4f0e8', l: '#fff8f4', f: '#f0a8a8', s: '#d04038' }),
  guppy: look('guppy', { b: '#f0c050', l: '#ffe8a8', f: '#e09828' }),
  angel: look('angel', { b: '#f0e4d0', l: '#fff8ee', f: '#d8c8a8' }),
  oscar: look('deep', { b: '#e07840', l: '#f0c090', f: '#c06030' }),
  pleco: look('eel', { b: '#6a5840', l: '#d0c4a8', w: '#3a3020' }),
  turtle: look('turtle', { b: '#6a8a40', l: '#d8e8a8' }),
  salary: look('salary', { b: '#3a4a68', l: '#d0d8e8', f: '#2a3858', t: '#d04545' }),
  boot: look('boot', { b: '#8a6246', l: '#c09068' }),
  can: look('can', { b: '#d5dee6', l: '#f4f7fa', r: '#d04545' }),
  weed: look('weed', { b: '#2f8a52', l: '#8fd070' }),
  note: look('note', { b: '#f3ead7', l: '#8a7058' }),
  bottle: look('bottle', { b: '#8ecfe0', l: '#e8f6fa' }),
  lamp: look('lamp', { b: '#6a5840', l: '#ffe070' }),
  leaf: look('leaf', { b: '#c47838', l: '#e8a060' }),
  umbrella: look('umbrella', { b: '#e07070', l: '#f0b0b0' }),
};

const FISH_KIND = {
  dart: { w: 16, h: 5, tail: 7, spread: 4, dorsal: 3 },
  deep: { w: 14, h: 9, tail: 6, spread: 6, dorsal: 5 },
  carp: { w: 18, h: 6, tail: 7, spread: 5, dorsal: 5, whisker: true },
  eel: { w: 28, h: 4, tail: 5, spread: 3, whisker: true },
  ribbon: { w: 32, h: 3, tail: 4, spread: 3 },
  fancy: { w: 14, h: 6, tail: 12, spread: 7, dorsal: 4, spots: true },
  spots: { w: 15, h: 6, tail: 8, spread: 5, dorsal: 4, spots: true },
  bars: { w: 14, h: 7, tail: 6, spread: 5, dorsal: 5, bars: true },
  betta: { w: 11, h: 6, tail: 14, spread: 9, dorsal: 7 },
  guppy: { w: 9, h: 4, tail: 9, spread: 6, dorsal: 2 },
  angel: { w: 6, h: 13, tail: 5, spread: 5, dorsal: 5 },
  flat: { w: 16, h: 7, tail: 5, spread: 3, eyes: 2 },
  clown: { w: 13, h: 6, tail: 6, spread: 4, dorsal: 3, bands: true },
  salary: { w: 14, h: 5, tail: 6, spread: 4, dorsal: 3, tie: true },
  shrimp: { critter: true },
  crab: { critter: true },
  star: { critter: true },
  jelly: { critter: true },
  horse: { critter: true },
  frog: { critter: true },
  skipper: { critter: true },
  turtle: { critter: true },
  snail: { critter: true },
  bat: { critter: true },
  boot: { critter: true },
  can: { critter: true },
  weed: { critter: true },
  note: { critter: true },
  leaf: { critter: true },
  lamp: { critter: true },
  bottle: { critter: true },
  umbrella: { critter: true },
};

function stampDots(ctx, dots, pal, x, y, scale, flip, ghost) {
  const s = scale || 1;
  if (!dots.length) return;
  const has = new Set(dots.map(([c, r]) => `${c},${r}`));
  const edge = [];
  const seen = new Set();
  dots.forEach(([c, r]) => {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const key = `${c + dx},${r + dy}`;
      if (!has.has(key) && !seen.has(key)) {
        seen.add(key);
        edge.push([c + dx, r + dy]);
      }
    });
  });
  const all = dots.map(([c, r]) => [c, r]).concat(edge);
  let minC = 999;
  let maxC = -999;
  let minR = 999;
  let maxR = -999;
  all.forEach(([c, r]) => {
    minC = Math.min(minC, c);
    maxC = Math.max(maxC, c);
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
  });
  const cx = (minC + maxC) / 2;
  const cy = (minR + maxR) / 2;
  const put = (c, r, color) => {
    const dx = flip ? (c - cx) : (cx - c);
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x + dx * s), Math.round(y + (r - cy) * s), s, s);
  };
  edge.forEach(([c, r]) => put(c, r, ghost ? '#4a4038' : '#14110e'));
  dots.forEach(([c, r, ch]) => {
    let color = ch === 'h' ? '#fffaf0' : (pal[ch] || pal.b);
    if (ghost) color = ch === 'e' || ch === 'h' ? '#d8d0c4' : '#8a7d70';
    put(c, r, color);
  });
}

function fishDots(kind, pal) {
  const k = FISH_KIND[kind];
  const dots = [];
  const add = (dx, dy, ch) => dots.push([dx, dy, ch]);
  const w = k.w;
  const h = k.h;
  for (let ix = -w; ix <= w; ix++) {
    const t = (ix + w) / (2 * w);
    const belly = Math.sin(Math.PI * Math.pow(Math.min(0.96, Math.max(0.04, t)), 0.9));
    const snout = t > 0.8 ? (1 - t) / 0.2 : 1;
    const neck = t < 0.16 ? 0.38 + t * 2.5 : 1;
    const hh = Math.max(1, Math.round(h * belly * snout * neck));
    for (let iy = -hh; iy <= hh; iy++) {
      let ch = iy > Math.max(1, hh * 0.15) ? 'l' : 'b';
      if (iy === 0) ch = 'f';
      if (k.bars && ix % 5 === 0) ch = 's';
      if (k.spots && (ix + iy * 3) % 7 === 0 && iy < 0) ch = 's';
      if (k.bands && (ix % 6 === 1 || ix % 6 === 2)) ch = 'w';
      if (k.tie && ix > w * 0.15 && iy >= 0 && iy < 3 && Math.abs(ix - w * 0.4) < 2) ch = 't';
      add(ix, iy, ch);
    }
  }
  for (let i = 1; i <= k.tail; i++) {
    const spread = Math.max(1, Math.round((i * k.spread) / k.tail));
    for (let t = -spread; t <= spread; t++) {
      if (i > k.tail * 0.4 && Math.abs(t) < Math.max(1, spread * 0.34)) continue;
      if (Math.abs(t) >= spread - 1 || i > k.tail - 2) add(-w - i, t, 'f');
      else add(-w - i, t, 'l');
    }
  }
  for (let i = 0; i < (k.dorsal || 0); i++) add(-1 + i, -h - 1 - (i % 3 === 0 ? 1 : 0), 'f');
  add(1, Math.round(h * 0.65), 'f');
  add(2, Math.round(h * 0.85), 'f');
  add(3, h + 1, 'f');
  const eyeY = -Math.max(1, Math.round(h * 0.32));
  if (k.eyes === 2) {
    add(w - 6, eyeY, 'e');
    add(w - 5, eyeY, 'p');
    add(w - 3, eyeY, 'e');
    add(w - 2, eyeY, 'p');
  } else if (!k.blind) {
    add(w - 4, eyeY, 'e');
    add(w - 3, eyeY, 'e');
    add(w - 3, eyeY + 1, 'e');
    add(w - 2, eyeY, 'p');
    add(w - 2, eyeY + 1, 'p');
    add(w - 4, eyeY, 'h');
  }
  for (let iy = -1; iy <= 1; iy++) add(w - 5, iy, 'f');
  if (k.whisker) {
    add(w + 1, 1, 'w');
    add(w + 2, 2, 'w');
    add(w + 3, 3, 'w');
    add(w + 1, 2, 'w');
  }
  return dots;
}

function critterDots(name) {
  const d = [];
  const a = (x, y, c) => d.push([x, y, c]);
  if (name === 'shrimp') {
    [[10, -8], [7, -5], [4, -2], [1, 0], [-2, 2], [-5, 3], [-8, 3]].forEach(([x, y], i) => {
      a(x, y, 'b'); a(x, y - 1, i % 2 ? 'l' : 'b'); a(x + 1, y, 'b'); a(x, y + 1, 'l');
    });
    a(12, -10, 'b'); a(13, -11, 'b'); a(8, -6, 'e'); a(9, -6, 'p');
    a(-9, 2, 'f'); a(-10, 4, 'f'); a(-8, 5, 'f');
  } else if (name === 'crab') {
    for (let x = -6; x <= 6; x++) for (let y = -4; y <= 3; y++) if (x * x / 36 + y * y / 16 < 1) a(x, y, (x + y) % 3 === 0 ? 'l' : 'b');
    a(-2, -2, 'e'); a(-1, -2, 'p'); a(2, -2, 'e'); a(3, -2, 'p');
    [[-10, -8], [-12, -10], [-11, -7], [10, -8], [12, -10], [11, -7]].forEach(([x, y]) => a(x, y, 'b'));
    [[-4, 5], [-2, 6], [0, 6], [2, 6], [4, 5]].forEach(([x, y]) => a(x, y, 'b'));
  } else if (name === 'star') {
    for (let i = -8; i <= 8; i++) { a(i, 0, 'b'); a(0, i, 'b'); a(i, i, Math.abs(i) < 5 ? 'l' : 'b'); a(i, -i, 'b'); }
  } else if (name === 'jelly') {
    for (let x = -8; x <= 8; x++) for (let y = -6; y <= 1; y++) if (x * x + (y + 2) * (y + 2) < 50) a(x, y, y < -3 ? 'l' : 'b');
    [-5, -2, 1, 4].forEach((x, i) => { a(x, 3, 'b'); a(x, 5 + (i % 2), 'l'); a(x, 7, 'b'); });
    a(-2, -2, 'p'); a(2, -2, 'p');
  } else if (name === 'horse') {
    for (let y = -10; y <= 6; y++) a(0, y, 'b');
    a(1, -10, 'b'); a(2, -9, 'b'); a(3, -8, 'b'); a(2, -8, 'e'); a(3, -8, 'p');
    a(-1, 7, 'b'); a(-2, 8, 'b'); a(-3, 8, 'f'); a(1, -2, 'l');
  } else if (name === 'frog') {
    a(-8, -6, 'b'); a(8, -6, 'b'); a(-8, -7, 'e'); a(-7, -7, 'p'); a(8, -7, 'e'); a(7, -7, 'p');
    for (let x = -6; x <= 6; x++) a(x, 0, 'b');
    a(-5, 1, 'l'); a(5, 1, 'l'); a(-7, 3, 'b'); a(7, 3, 'b'); a(-4, 3, 'b'); a(4, 3, 'b');
  } else if (name === 'skipper') {
    for (let x = -7; x <= 7; x++) for (let y = -3; y <= 2; y++) a(x, y, y > 0 ? 'l' : 'b');
    a(-3, -5, 'e'); a(-2, -5, 'p'); a(3, -5, 'e'); a(4, -5, 'p');
    a(-5, 4, 'b'); a(-3, 5, 'b'); a(3, 5, 'b'); a(5, 4, 'b');
  } else if (name === 'turtle') {
    for (let x = -7; x <= 5; x++) for (let y = -5; y <= 3; y++) a(x, y, (x + y) % 2 ? 'l' : 'b');
    a(7, -1, 'l'); a(8, -1, 'b'); a(9, -2, 'e'); a(10, -2, 'p');
    a(-6, 5, 'b'); a(-2, 5, 'b'); a(2, 5, 'b'); a(5, 5, 'b');
  } else if (name === 'snail') {
    for (let x = -6; x <= 3; x++) for (let y = -6; y <= 2; y++) if (x * x + y * y < 30) a(x, y, x < 0 ? 'b' : 'l');
    a(4, 2, 'l'); a(6, 2, 'l'); a(7, 2, 'b'); a(-2, 4, 'b'); a(1, 4, 'b');
  } else if (name === 'bat') {
    for (let x = -14; x <= 14; x++) a(x, 0, 'f');
    for (let x = -6; x <= 8; x++) { a(x, 0, 'b'); a(x, 1, 'l'); }
    a(8, -1, 'e'); a(9, -1, 'p');
    for (let x = -12; x <= 12; x += 3) a(x, x % 2 ? -2 : 2, 'f');
  } else if (name === 'boot') {
    [[0, -8], [1, -8], [0, -4], [0, 0], [1, 0], [4, 0], [6, 0], [6, 1], [-2, 0]].forEach(([x, y]) => { a(x, y, 'b'); a(x, y + 1, 'l'); });
  } else if (name === 'can') {
    for (let y = -8; y <= 8; y++) { a(-3, y, 'b'); a(0, y, y === 0 ? 'r' : 'l'); a(3, y, 'b'); }
  } else if (name === 'weed') {
    [[-6, 6], [-6, 2], [-4, -2], [-2, -6], [2, 6], [2, 0], [4, -4], [0, 4]].forEach(([x, y]) => a(x, y, 'b'));
  } else if (name === 'note') {
    for (let y = -8; y <= 8; y++) { a(-4, y, 'b'); a(0, y, 'b'); a(4, y, 'b'); }
    a(-2, -2, 'l'); a(0, 0, 'l'); a(-2, 2, 'l');
  } else if (name === 'leaf') {
    [[-6, 4], [-3, 1], [0, -2], [3, -4], [5, -5], [1, 0], [-1, 2]].forEach(([x, y]) => a(x, y, 'b'));
    a(0, -1, 'l');
  } else if (name === 'lamp') {
    a(0, -8, 'l'); a(-2, -5, 'b'); a(0, -5, 'l'); a(2, -5, 'b'); a(0, -2, 'b'); a(0, 2, 'b'); a(0, 6, 'b');
  } else if (name === 'bottle') {
    for (let y = -8; y <= -2; y++) a(0, y, 'l');
    for (let y = -1; y <= 8; y++) { a(-2, y, 'b'); a(0, y, 'l'); a(2, y, 'b'); }
  } else if (name === 'umbrella') {
    for (let x = -8; x <= 8; x++) a(x, -4, 'b');
    a(-8, -2, 'b'); a(8, -2, 'b'); a(0, 0, 'l'); a(0, 4, 'l'); a(0, 8, 'b');
  }
  return d;
}

function paintSprite(ctx, kind, pal, x, y, scale, flip, ghost) {
  const info = FISH_KIND[kind] || FISH_KIND.dart;
  const dots = info.critter ? critterDots(kind) : fishDots(kind, pal);
  stampDots(ctx, dots, pal, x, y, scale, flip, ghost);
}

const FACT = {
  minnow: { where: '东亚。中国东部、朝鲜半岛、日本的溪流、沟渠和池塘，后来也进入欧洲一些河道', water: '淡水', size: '4–10 厘米' },
  crucian: { where: '东亚。中国各地湖泊、池塘、稻田，欧洲和北美也有引入种群', water: '淡水', size: '15–30 厘米' },
  shrimp: { where: '东亚淡水。中国东部江河、湖泊和池塘的浅水草边', water: '淡水', size: '3–6 厘米' },
  loach: { where: '东亚。中国、朝鲜半岛、日本的泥底沟渠、稻田和水塘', water: '淡水', size: '10–20 厘米' },
  bitter: { where: '东亚。中国东部缓流和静水，常靠近河蚌生活', water: '淡水', size: '4–8 厘米' },
  tilapia: { where: '原产非洲热带淡水。现在华南以及世界许多暖水区的池塘、水库都有', water: '淡水，也能进半咸水', size: '20–40 厘米' },
  snail: { where: '东亚淡水。中国湖泊、池塘、稻田的软泥上', water: '淡水', size: '壳高 3–6 厘米' },
  bream: { where: '东亚。长江、黑龙江等中国江河湖泊的中下层', water: '淡水', size: '20–40 厘米' },
  yellow: { where: '东亚。中国东部江河、湖泊的底层', water: '淡水', size: '10–25 厘米' },
  catfish: { where: '东亚。中国江河、湖泊和水库的底层，夜行', water: '淡水', size: '30–80 厘米，大的超过 1 米' },
  carp: { where: '欧亚大陆。从东欧到东亚的江河湖泊都有，后来几乎传到世界各地的温水', water: '淡水', size: '30–80 厘米' },
  grass: { where: '东亚。长江、珠江等中国大河，已引入亚、欧、美许多水域', water: '淡水', size: '40–100 厘米' },
  silver: { where: '东亚。中国东部各大水系的中上层，也已引入北美洲等地上游', water: '淡水', size: '40–90 厘米' },
  goldfish: { where: '由东亚的鲫鱼培育而来。世界各地的鱼缸和庭院水池', water: '淡水', size: '5–20 厘米' },
  gui: { where: '东亚。长江、珠江流域的江河和湖泊，喜欢缓流和清水', water: '淡水', size: '20–50 厘米' },
  snake: { where: '东亚。中国、朝鲜半岛、俄罗斯远东的湖泊沼泽，北美部分水域有入侵种群', water: '淡水', size: '30–80 厘米' },
  koi: { where: '观赏鲤，培育中心在东亚，尤其日本和中国。世界各地的庭院水池', water: '淡水', size: '30–70 厘米' },
  moon: { where: '没有野外种群，只活在这口塘的说法里', water: '淡水', size: '大约一掌' },
  golden: { where: '金色观赏鲤。源自东亚的养殖池，现在各地公园和庭院都能见到', water: '淡水', size: '30–60 厘米' },
  sardine: { where: '温带和亚热带近海。大西洋、太平洋、印度洋都有成群的沙丁鱼', water: '海水', size: '10–25 厘米' },
  pomfret: { where: '印度洋到西太平洋的近海。东海、南海常见', water: '海水', size: '20–40 厘米' },
  hairtail: { where: '热带和温带大陆架。西太平洋最多，东海是主要渔场之一', water: '海水', size: '50–120 厘米' },
  flounder: { where: '世界各处的沙泥质近海。西北太平洋和中国近海都有常见种类', water: '海水', size: '20–50 厘米' },
  crab: { where: '东亚沿海的泥滩、河口和浅海，退潮后的滩涂上尤其多', water: '海水到半咸水', size: '壳宽 5–15 厘米' },
  star: { where: '世界各处的浅海岩礁和沙底。潮间带到几十米深都有', water: '海水', size: '腕长 5–20 厘米' },
  jelly: { where: '海月水母生活在温带近海，太平洋、大西洋沿岸都能见到', water: '海水', size: '伞径 10–30 厘米' },
  clown: { where: '热带印度洋和西太平洋的珊瑚礁，住在海葵里', water: '海水', size: '6–12 厘米' },
  horse: { where: '热带和温带浅海的海草床。印度洋、西太平洋，也包括中国南方近海', water: '海水', size: '5–15 厘米' },
  dragon: { where: '印度洋到西太平洋的海草和珊瑚缝。和海马是近亲', water: '海水', size: '10–30 厘米' },
  blind: { where: '无光洞穴。中国西南喀斯特溶洞，以及世界其他地下河', water: '淡水', size: '5–12 厘米' },
  cshrimp: { where: '洞穴地下水。华南溶洞和世界各地的地下河都有类似的透明虾', water: '淡水', size: '2–5 厘米' },
  bat: { where: '暖海海底。大西洋和印度洋—太平洋的沙底、岩礁附近有多种蝙蝠鱼', water: '海水', size: '15–40 厘米' },
  crystal: { where: '没有公认的野外种。按塘里的说法，它停在溶洞滴水的地方', water: '淡水', size: '大约一指' },
  glow: { where: '没有野外记录。塘里把它算作洞中会发光的水母', water: '淡水', size: '伞径约一掌' },
  spirit: { where: '没有野外种群，只在这口溶洞的故事里出现', water: '淡水', size: '大约一掌' },
  betta: { where: '东南亚。泰国、柬埔寨、越南的稻田、水沟和缓流', water: '淡水', size: '5–7 厘米' },
  skipper: { where: '印度洋到西太平洋的红树林和泥滩，中国南方海岸也有', water: '半咸水，能短时间离水', size: '8–15 厘米' },
  frog: { where: '东亚。中国、朝鲜半岛、日本的池塘边、稻田和雨后的树叶上', water: '淡水边的陆地', size: '3–5 厘米' },
  rainkoi: { where: '仍是东亚培育的锦鲤。雨天靠近岸，是这口塘里的说法', water: '淡水', size: '30–60 厘米' },
  guppy: { where: '原产南美东北部，委内瑞拉到特立尼达。现在世界各地的鱼缸和暖水沟渠', water: '淡水', size: '2–5 厘米' },
  angel: { where: '南美亚马孙河流域的缓流和淹水森林', water: '淡水', size: '体高 10–15 厘米' },
  oscar: { where: '南美亚马孙河和奥里诺科河流域，也是常见的观赏鱼', water: '淡水', size: '20–35 厘米' },
  pleco: { where: '南美淡水，尤其亚马孙河系的河底和沉木。世界各地鱼缸里很常见', water: '淡水', size: '10–40 厘米，有的种类更大' },
  turtle: { where: '东亚的池塘、稻田和缓流。中国、朝鲜半岛、日本都有常见的水龟', water: '淡水', size: '背甲 8–20 厘米' },
  salary: { where: '没有这种鱼。它是这口鱼缸里的一句玩笑', water: '淡水', size: '大约一掌' },
  boot: { where: '不是生物。旧鞋会从乡村沟渠、码头和雨天的路边漂进来', water: '哪儿都能泡着', size: '一只鞋' },
  can: { where: '不是生物。河边、海边和鱼缸角落都能见到被人留下的空罐', water: '随水走', size: '一个罐子' },
  weed: { where: '淡水水草的断枝。池塘和沟渠里自己断下来的', water: '淡水', size: '一缕' },
  note: { where: '不是生物。字条从窗台、口袋和雨里掉进水中', water: '随水走', size: '一张纸' },
  bottle: { where: '不是生物。玻璃瓶从海边和河口漂来', water: '海水或河水', size: '一个瓶子' },
  lamp: { where: '不是生物。旧矿灯来自矿道和溶洞边被人放下的地方', water: '洞里', size: '一盏灯' },
  leaf: { where: '不是生物。秋天的树叶从东亚的行道树和院落掉进水里', water: '随雨走', size: '一片叶' },
  umbrella: { where: '不是生物。纸伞从雨天的街头掉进檐沟', water: '雨水', size: '一把小伞' },
};

const Sprites = {
  intro(id) {
    return INTRO[id] || '';
  },
  about(id) {
    return FACT[id] || null;
  },
  draw(ctx, item, x, y, scale, flip, ghost) {
    if (!item) return;
    const spec = LOOK[item.id] || look('dart', { b: item.color || '#e0b878' });
    paintSprite(ctx, spec.mask, spec.pal, x, y, scale || 1, !!flip, !!ghost);
  },
};

window.Sprites = Sprites;
