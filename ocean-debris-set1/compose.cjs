const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

const ROOT = __dirname;
const ASSET_DIR = "C:/Users/lenovo/.cursor/projects/d-Data-IDEAL/assets";
const W = 720;
const H = 1024;

const SOURCES = {
  "plastic-bottle": "tide-bottle.jpg",
  "plastic-bag": "tide-bag.jpg",
  "glass-bottle": "tide-glass.jpg",
  "fishing-net": "tide-net.jpg",
  "soda-can": "tide-can.jpg",
  "flip-flop": "tide-slipper.jpg",
  "fishing-line": "tide-line.jpg",
  "foam-box": "tide-foam.jpg",
  "balloon": "tide-balloon-round.jpg",
  "tire": "tide-tire.jpg",
  "bottle-cap": "tide-cap.jpg",
  "straw": "tide-straw.jpg",
  "lighter": "tide-lighter.jpg",
  "toothbrush": "tide-brush.jpg",
  "mask": "tide-mask.jpg",
  "cigarette": "tide-butt.jpg",
  "takeout-box": "tide-box.jpg",
  "six-pack-ring": "tide-rings-six.jpg",
  "plastic-bottle-legend": "tide-bottle-legend.jpg",
  "plastic-bag-legend": "tide-bag-legend.jpg",
  "glass-bottle-legend": "tide-glass-legend.jpg",
  "fishing-net-legend": "tide-net-legend.jpg",
};

const RARITY = {
  普通: {
    hi: "#d9d0c2",
    mid: "#8a8175",
    lo: "#3e3933",
    edge: "#201c18",
    banner: "#2c261f",
    bannerEdge: "#c4b49a",
    gem: "#d5dbe3",
    gemHi: "#ffffff",
    gemLo: "#7d8794",
    wash: "rgba(40, 36, 28, 0.12)",
    ink: "#3a2c22",
    parchment1: "#f4e6cb",
    parchment2: "#e4d0aa",
    rule: "#b89a6e",
    footer: "#8d7350",
    label: "#5c5348",
  },
  稀有: {
    hi: "#c5e4fb",
    mid: "#2f74b8",
    lo: "#123056",
    edge: "#071422",
    banner: "#10283f",
    bannerEdge: "#9fd0f2",
    gem: "#3eb0ff",
    gemHi: "#e7f6ff",
    gemLo: "#0d5ea8",
    wash: "rgba(10, 40, 80, 0.16)",
    ink: "#1b3048",
    parchment1: "#e7f1f8",
    parchment2: "#d5e4f0",
    rule: "#7eabc8",
    footer: "#4d7090",
    label: "#1d5f93",
  },
  史诗: {
    hi: "#e2c6f8",
    mid: "#7a45b0",
    lo: "#2a1244",
    edge: "#140818",
    banner: "#241033",
    bannerEdge: "#d2b0ee",
    gem: "#c06bff",
    gemHi: "#f7e8ff",
    gemLo: "#6a22a8",
    wash: "rgba(50, 16, 80, 0.18)",
    ink: "#2c1840",
    parchment1: "#f3e9f8",
    parchment2: "#e3d4f0",
    rule: "#b48ccc",
    footer: "#7a5a90",
    label: "#7a35a8",
  },
  传说: {
    hi: "#ffe3a3",
    mid: "#d3922a",
    lo: "#5a3208",
    edge: "#241404",
    banner: "#3a240c",
    bannerEdge: "#ffd98a",
    gem: "#ffb020",
    gemHi: "#fff6d4",
    gemLo: "#a85e08",
    wash: "rgba(120, 70, 10, 0.14)",
    ink: "#4a2c0c",
    parchment1: "#fff1d4",
    parchment2: "#f0d7a4",
    rule: "#d7ae62",
    footer: "#a07838",
    label: "#a85e08",
  },
};

const GROUPS = [
  {
    name: "塑料瓶",
    art: "plastic-bottle",
    legendArt: "plastic-bottle-legend",
    caption: "半埋在晚潮里，蓝盖还拧着，旁边一只寄居蟹。",
    legendCaption: "瓶子立在礁石上，螃蟹围成一小圈。",
    tiers: [
      ["普通", ["盖子拧紧了。", "海没有。"]],
      ["稀有", ["标签还在。", "保质期写着：涨潮。"]],
      ["史诗", ["瓶中装着半口风。", "像一封未寄出的信。"]],
      ["传说", ["找到瓶盖的人，", "就能把这截海岸", "重新封上。"]],
    ],
  },
  {
    name: "塑料袋",
    art: "plastic-bag",
    legendArt: "plastic-bag-legend",
    caption: "涨满风的白袋子，浮在金色的水面上。",
    legendCaption: "袋子升到月亮前面，两只把手还举着。",
    tiers: [
      ["普通", ["它跟着浪走，", "比鱼还勤。"]],
      ["稀有", ["撑开时像一只", "不会下沉的水母。"]],
      ["史诗", ["渔民叫它白帆。", "帆上没有船。"]],
      ["传说", ["它曾罩住月亮。", "月亮挣脱之后，", "只留下一只把手。"]],
    ],
  },
  {
    name: "玻璃瓶",
    art: "glass-bottle",
    legendArt: "glass-bottle-legend",
    caption: "潮池里的绿玻璃瓶，软木塞还在。",
    legendCaption: "瓶身自己发亮，盐结在玻璃外面。",
    tiers: [
      ["普通", ["绿玻璃躺在潮池里，", "月亮已经上来了。"]],
      ["稀有", ["瓶底的年份，", "比灯塔更早。"]],
      ["史诗", ["对着瓶口倾听，", "旧航线一声，", "又一声。"]],
      ["传说", ["软木塞还在。", "里面的信，", "写成了盐。"]],
    ],
  },
  {
    name: "渔网",
    art: "fishing-net",
    legendArt: "fishing-net-legend",
    caption: "旧网挂在黑礁上，像一扇没有门板的门。",
    legendCaption: "网拉在两座海蚀柱之间，鱼从网眼里过。",
    tiers: [
      ["普通", ["网住两只拖鞋，", "和一段下午。"]],
      ["稀有", ["补过三次。", "每一次都比鱼", "更有耐心。"]],
      ["史诗", ["退潮后它还立着，", "像一座没有渔夫的门。"]],
      ["传说", ["它不再捕鱼。", "鱼从网眼里游过，", "向它行礼。"]],
    ],
  },
  {
    name: "易拉罐",
    art: "soda-can",
    caption: "站在浪沫里的银罐子，腰上一条红。",
    tiers: [
      ["普通", ["拉环还在。", "汽早就加入了洋流。"]],
      ["稀有", ["红圈还亮着。", "里面的汽，已经入海。"]],
      ["史诗", ["摇一摇。", "里面是干了的潮声。"]],
    ],
  },
  {
    name: "人字拖",
    art: "flip-flop",
    caption: "落在湿沙上的一只蓝拖，另一只不在。",
    tiers: [
      ["普通", ["左脚。", "右脚在下一季季风里。"]],
      ["稀有", ["鞋底的纹路，", "还记得一个人的重量。"]],
      ["史诗", ["另一只成了蟹的屋顶。", "这只负责怀念。"]],
    ],
  },
  {
    name: "渔线",
    art: "fishing-line",
    caption: "一根亮线缠在藤壶礁上，延伸进海里。",
    tiers: [
      ["普通", ["缠在礁石上，", "亮得像一句没写完的话。"]],
      ["稀有", ["另一头沉进海里，", "钓着一整段沉默。"]],
      ["史诗", ["有人沿这根线走远，", "走回了自己的船。"]],
    ],
  },
  {
    name: "泡沫箱",
    art: "foam-box",
    caption: "白泡沫箱搁在风暴后的沙滩上，盖子掀着一条缝。",
    tiers: [
      ["普通", ["曾经装过鱼。", "现在装风，也不漏。"]],
      ["稀有", ["盖子掀着一条缝。", "里面是干燥的、", "不属于海的黑暗。"]],
      ["史诗", ["它漂过三个台风，", "形状还是一只箱子。"]],
    ],
  },
  {
    name: "气球",
    art: "balloon",
    caption: "一只心形红气球瘪在黑礁上，结还系着，绳子垂下来。",
    tiers: [
      ["普通", ["瘪了。", "颜色还记得生日。"]],
      ["稀有", ["绳子的结打得认真，", "像还准备升空。"]],
      ["史诗", ["夜潮把它托上礁石。", "远远看去，", "像一颗搁浅的心。"]],
    ],
  },
  {
    name: "轮胎",
    art: "tire",
    caption: "一只旧轮胎卡在峡湾里，外圈住满藤壶。",
    tiers: [
      ["普通", ["每座海湾都有一个，", "所以它只算普通。"]],
      ["稀有", ["藤壶住满了外圈，", "把它当成移动的岛。"]],
      ["史诗", ["孩子们叫它船。", "海同意了半个下午。"]],
    ],
  },
  {
    name: "瓶盖",
    art: "bottle-cap",
    caption: "一枚没有字的铁盖，齿纹朝下，旁边一滴水。",
    tiers: [
      ["普通", ["齿纹还锋利。", "它告别的瓶子", "在很远的地方。"]],
      ["稀有", ["内侧的漆还亮着。", "海把它擦得很认真。"]],
    ],
  },
  {
    name: "吸管",
    art: "straw",
    caption: "弯吸管插在沙里，还保持着喝的角度。",
    tiers: [
      ["普通", ["弯折处还保持着", "喝饮料的角度。"]],
      ["稀有", ["一整根，没有断。", "收藏家为此", "沉默了很久。"]],
    ],
  },
  {
    name: "打火机",
    art: "lighter",
    caption: "橘红色打火机立在黑卵石上，轮子还在。",
    tiers: [
      ["普通", ["打不着。", "轮子还记得拇指。"]],
      ["稀有", ["防风罩完好。", "火没有了，", "风也进不去。"]],
    ],
  },
  {
    name: "牙刷",
    art: "toothbrush",
    caption: "黄牙刷半截埋在沙里，刷毛朝向海。",
    tiers: [
      ["普通", ["刷毛还翘着。", "像在给沙滩刷牙。"]],
      ["稀有", ["颜色新鲜得不像话。", "海把它保护得太好。"]],
    ],
  },
  {
    name: "口罩",
    art: "mask",
    caption: "浅蓝口罩和海藻缠在一起，耳绳还在。",
    tiers: [
      ["普通", ["耳绳还打着结。", "主人先一步走了。"]],
      ["稀有", ["折叠得很整齐，", "像一枚认真穿过的壳。"]],
    ],
  },
  {
    name: "烟蒂",
    art: "cigarette",
    caption: "一支灭了的烟立在潮线边上，滤嘴埋进沙里。",
    tiers: [
      ["普通", ["它立在潮线边上。", "火已经灭了。"]],
      ["稀有", ["海盐爬上了滤嘴。", "火是很久以前的事。"]],
    ],
  },
  {
    name: "外卖盒",
    art: "takeout-box",
    caption: "扣紧的白色外卖盒，盒面上没有字。",
    tiers: [
      ["普通", ["扣盖还响。", "菜喂过整条海岸线。"]],
      ["稀有", ["盒底印着一条街。", "那条街离海很远。"]],
    ],
  },
  {
    name: "罐环",
    art: "six-pack-ring",
    caption: "一排连着的圆塑料环躺在沙上，旁边一只蟹。",
    tiers: [
      ["普通", ["罐子都走了。", "环还圈着空气。"]],
      ["稀有", ["小蟹从环旁经过，", "头也不回。"]],
    ],
  },
];

function buildCards() {
  const cards = [];
  let n = 1;
  for (const group of GROUPS) {
    for (const [rarity, lines] of group.tiers) {
      const art = rarity === "传说" && group.legendArt ? group.legendArt : group.art;
      cards.push({
        id: `OG-${String(n).padStart(3, "0")}`,
        no: n,
        name: group.name,
        rarity,
        art,
        lines,
        flavor: lines.join("\n"),
        flat: `flat/OG-${String(n).padStart(3, "0")}.png`,
        painting: `art/${art}.jpg`,
      });
      n += 1;
    }
  }
  if (cards.length !== 50) {
    throw new Error(`卡牌数量是 ${cards.length}，应该是 50`);
  }
  const counts = { 普通: 0, 稀有: 0, 史诗: 0, 传说: 0 };
  for (const card of cards) counts[card.rarity] += 1;
  return { cards, counts };
}

function buildPaintings(cards) {
  const byId = new Map();
  for (const group of GROUPS) {
    byId.set(group.art, {
      id: group.art,
      name: group.name,
      caption: group.caption,
      file: `art/${group.art}.jpg`,
      rarities: [],
    });
    if (group.legendArt) {
      byId.set(group.legendArt, {
        id: group.legendArt,
        name: group.name,
        caption: group.legendCaption,
        file: `art/${group.legendArt}.jpg`,
        rarities: [],
      });
    }
  }
  for (const card of cards) {
    byId.get(card.art).rarities.push(card.rarity);
  }
  return [...byId.values()];
}

function registerFonts() {
  const nameOk = GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "CardName");
  const flavorOk = GlobalFonts.registerFromPath("C:/Windows/Fonts/simkai.ttf", "CardFlavor");
  if (!nameOk) GlobalFonts.registerFromPath("C:/Windows/Fonts/simhei.ttf", "CardName");
  if (!flavorOk) throw new Error("楷体字体加载失败");
  const probe = createCanvas(10, 10).getContext("2d");
  probe.font = "40px CardName";
  const width = probe.measureText("塑料瓶").width;
  if (width < 40) throw new Error(`卡名字体不可用，测量宽度 ${width}`);
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function traceArt(ctx) {
  const left = 36;
  const right = 684;
  const shoulder = 124;
  const peak = 30;
  const bottom = 586;
  const r = 16;
  ctx.beginPath();
  ctx.moveTo(left, shoulder);
  ctx.quadraticCurveTo(360, peak, right, shoulder);
  ctx.lineTo(right, bottom - r);
  ctx.quadraticCurveTo(right, bottom, right - r, bottom);
  ctx.lineTo(left + r, bottom);
  ctx.quadraticCurveTo(left, bottom, left, bottom - r);
  ctx.closePath();
}

function traceBanner(ctx, cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const tip = 22;
  ctx.beginPath();
  ctx.moveTo(x + tip, y);
  ctx.lineTo(x + w - tip, y);
  ctx.lineTo(x + w, cy);
  ctx.lineTo(x + w - tip, y + h);
  ctx.lineTo(x + tip, y + h);
  ctx.lineTo(x, cy);
  ctx.closePath();
}

function traceHex(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = Math.PI / 6 + (i * Math.PI) / 3;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawCover(ctx, img, dx, dy, dw, dh) {
  const scale = Math.max(dw / img.width, dh / img.height);
  const cw = dw / scale;
  const ch = dh / scale;
  const sx = (img.width - cw) / 2;
  const sy = Math.max(0, (img.height - ch) / 2 - img.height * 0.03);
  ctx.drawImage(img, sx, sy, cw, ch, dx, dy, dw, dh);
}

function drawSpaced(ctx, text, cx, cy, spacing) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (text.length - 1);
  let x = cx - total / 2;
  const previous = ctx.textAlign;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i += 1) {
    ctx.strokeText(text[i], x, cy);
    ctx.fillText(text[i], x, cy);
    x += widths[i] + spacing;
  }
  ctx.textAlign = previous;
}

function drawDiamond(ctx, x, y, s, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawCard(card, img) {
  const pal = RARITY[card.rarity];
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  ctx.save();
  roundedRect(ctx, 0, 0, W, H, 42);
  ctx.clip();

  const metal = ctx.createLinearGradient(0, 0, W, H);
  metal.addColorStop(0, pal.hi);
  metal.addColorStop(0.42, pal.mid);
  metal.addColorStop(1, pal.lo);
  ctx.fillStyle = metal;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  traceArt(ctx);
  ctx.clip();
  drawCover(ctx, img, 20, 16, 680, 590);
  ctx.fillStyle = pal.wash;
  ctx.fillRect(0, 0, W, H);
  const vignette = ctx.createRadialGradient(360, 320, 120, 360, 330, 430);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  traceArt(ctx);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(0,0,0,0.72)";
  ctx.stroke();
  traceArt(ctx);
  ctx.lineWidth = 2;
  ctx.strokeStyle = pal.hi;
  ctx.stroke();

  traceBanner(ctx, 360, 108, 560, 74);
  const banner = ctx.createLinearGradient(80, 72, 80, 146);
  banner.addColorStop(0, pal.bannerEdge);
  banner.addColorStop(0.18, pal.banner);
  banner.addColorStop(0.82, pal.banner);
  banner.addColorStop(1, "#050403");
  ctx.fillStyle = banner;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = pal.bannerEdge;
  ctx.stroke();

  ctx.font = "52px CardName";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff6df";
  ctx.strokeStyle = "rgba(0,0,0,0.88)";
  ctx.lineWidth = 7;
  ctx.lineJoin = "round";
  const nameSpacing = card.name.length <= 2 ? 18 : 6;
  drawSpaced(ctx, card.name, 360, 110, nameSpacing);

  const gemY = 586;
  ctx.beginPath();
  ctx.arc(360, gemY, 38, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(360, gemY, 33, 0, Math.PI * 2);
  ctx.fillStyle = pal.hi;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(360, gemY, 29, 0, Math.PI * 2);
  ctx.fillStyle = pal.lo;
  ctx.fill();
  traceHex(ctx, 360, gemY, 24);
  const gem = ctx.createLinearGradient(336, 560, 384, 612);
  gem.addColorStop(0, pal.gemHi);
  gem.addColorStop(0.45, pal.gem);
  gem.addColorStop(1, pal.gemLo);
  ctx.fillStyle = gem;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(350, 576, 7, 4, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();

  roundedRect(ctx, 42, 648, 636, 322, 18);
  const paper = ctx.createLinearGradient(42, 648, 42, 970);
  paper.addColorStop(0, pal.parchment1);
  paper.addColorStop(1, pal.parchment2);
  ctx.fillStyle = paper;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = pal.rule;
  ctx.stroke();

  ctx.font = "28px CardName";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const typeLeft = "收藏 · ";
  const typeRight = card.rarity;
  const typeWidth = ctx.measureText(typeLeft).width + ctx.measureText(typeRight).width;
  const typeX = 360 - typeWidth / 2;
  ctx.fillStyle = pal.ink;
  ctx.fillText(typeLeft, typeX, 692);
  ctx.fillStyle = pal.label;
  ctx.fillText(typeRight, typeX + ctx.measureText(typeLeft).width, 692);
  ctx.textAlign = "center";

  ctx.beginPath();
  ctx.moveTo(92, 724);
  ctx.lineTo(628, 724);
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  let flavorSize = 34;
  ctx.textAlign = "center";
  while (flavorSize > 22) {
    ctx.font = `${flavorSize}px CardFlavor`;
    const widest = Math.max(...card.lines.map((line) => ctx.measureText(line).width));
    if (widest <= 520) break;
    flavorSize -= 1;
  }
  ctx.font = `${flavorSize}px CardFlavor`;
  ctx.fillStyle = pal.ink;
  const lineHeight = flavorSize * 1.45;
  const block = card.lines.length * lineHeight;
  let lineY = 818 - block / 2 + lineHeight / 2;
  for (const line of card.lines) {
    ctx.fillText(line, 360, lineY);
    lineY += lineHeight;
  }

  ctx.font = "20px CardFlavor";
  ctx.fillStyle = pal.footer;
  ctx.fillText("第一弹 · 退潮", 360, 930);

  ctx.font = "18px CardName";
  ctx.fillStyle = pal.hi;
  ctx.fillText(String(card.no).padStart(2, "0"), 360, 998);

  const ornaments = [
    [58, 58],
    [662, 58],
    [58, 992],
    [662, 992],
  ];
  if (card.rarity === "传说") {
    for (const [x, y] of ornaments) drawDiamond(ctx, x, y, 8, pal.gemHi, pal.lo);
  } else {
    for (const [x, y] of ornaments) {
      ctx.beginPath();
      ctx.arc(x, y, card.rarity === "史诗" ? 6 : 5, 0, Math.PI * 2);
      ctx.fillStyle = pal.hi;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = pal.lo;
      ctx.stroke();
    }
  }

  roundedRect(ctx, 8, 8, W - 16, H - 16, 36);
  ctx.lineWidth = 4;
  ctx.strokeStyle = pal.edge;
  ctx.stroke();

  ctx.restore();
  return canvas;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeGallery(cards, paintings, counts) {
  const groups = [];
  for (const card of cards) {
    let group = groups.find((item) => item.name === card.name);
    if (!group) {
      group = { name: card.name, cards: [] };
      groups.push(group);
    }
    group.cards.push(card);
  }

  const cardHtml = groups
    .map((group) => {
      const items = group.cards
        .map(
          (card) => `<button class="card" type="button" data-rarity="${esc(card.rarity)}" data-id="${esc(card.id)}">
            <img src="${esc(card.flat)}" alt="${esc(card.name)}，${esc(card.rarity)}">
          </button>`
        )
        .join("");
      return `<section class="group" data-name="${esc(group.name)}">
        <h2>${esc(group.name)}<span>${group.cards.length} 张</span></h2>
        <div class="row">${items}</div>
      </section>`;
    })
    .join("");

  const wideHtml = paintings
    .map(
      (painting) => `<figure class="wide" data-rarities="${esc(painting.rarities.join(" "))}">
        <img src="${esc(painting.file)}" alt="${esc(painting.name)}的阔画">
        <figcaption>
          <strong>${esc(painting.name)}</strong>
          <em>${esc(painting.rarities.join(" · "))}</em>
          <span>${esc(painting.caption)}</span>
        </figcaption>
      </figure>`
    )
    .join("");

  const catalog = cards.map((card) => ({
    id: card.id,
    name: card.name,
    rarity: card.rarity,
    lines: card.lines,
    flat: card.flat,
    painting: card.painting,
  }));

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>第一弹 · 退潮</title>
  <style>
    :root {
      --bg: #141816;
      --ink: #f3ecdf;
      --muted: #b7ad9d;
      --line: #343b36;
      --paper: #221e19;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: "Microsoft YaHei", "SimHei", sans-serif;
    }
    header, main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
    header { padding: 36px 0 8px; }
    h1 { margin: 0 0 8px; font-size: 32px; font-weight: 700; letter-spacing: 0.08em; }
    .lead { margin: 0; max-width: 68ch; color: var(--muted); line-height: 1.7; }
    .stats { display: flex; flex-wrap: wrap; gap: 10px 18px; margin: 18px 0; color: var(--ink); }
    .stats b { font-weight: 700; }
    .common { color: #d9d0c2; }
    .rare { color: #7ec4f5; }
    .epic { color: #d2a4f3; }
    .legend { color: #ffc45a; }
    .bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 22px; }
    button, .tab {
      background: transparent;
      color: var(--ink);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 7px 14px;
      font: inherit;
      cursor: pointer;
    }
    button[aria-pressed="true"], .tab[aria-pressed="true"] { background: var(--ink); color: #1a1612; }
    .count { margin-left: auto; color: var(--muted); }
    h2 { display: flex; justify-content: space-between; align-items: baseline; font-size: 20px; margin: 28px 0 12px; }
    h2 span { color: var(--muted); font-size: 14px; font-weight: 400; }
    .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .card { padding: 0; border: 0; border-radius: 8px; background: transparent; }
    .card img { width: 100%; display: block; border-radius: 8px; }
    .wides { display: grid; gap: 28px; }
    .wides[hidden], .back-view[hidden] { display: none; }
    .wide { margin: 0; background: var(--paper); border-radius: 12px; overflow: hidden; }
    .wide img { width: 100%; display: block; }
    figcaption { display: grid; gap: 4px; padding: 14px 16px 16px; }
    figcaption strong { font-size: 18px; }
    figcaption em { font-style: normal; color: var(--legend); }
    figcaption span { color: var(--muted); }
    dialog { width: min(1040px, calc(100% - 24px)); max-height: calc(100vh - 32px); overflow: auto; border: 0; border-radius: 16px; background: #1c1915; color: var(--ink); padding: 18px; }
    dialog::backdrop { background: rgba(0, 0, 0, 0.72); }
    .detail { display: grid; grid-template-columns: minmax(180px, 280px) 1fr; gap: 18px; align-items: start; }
    #flatImg { width: 100%; max-height: 78vh; object-fit: contain; border-radius: 10px; }
    #wideImg { width: 100%; max-height: 42vh; object-fit: cover; object-position: center 40%; border-radius: 10px; }
    .detail h3 { margin: 0 0 6px; font-size: 28px; }
    .meta { margin: 0 0 12px; color: var(--legend); }
    .flavor { margin: 0; font-family: KaiTi, STKaiti, serif; font-size: 24px; line-height: 1.6; }
    .close { margin-top: 16px; }
    .back-view { display: grid; grid-template-columns: repeat(2, minmax(180px, 320px)); gap: 28px; justify-content: center; margin: 8px 0 40px; }
    .back-view figure { margin: 0; }
    .back-view img { width: 100%; display: block; border-radius: 10px; }
    .back-view figcaption { margin-top: 10px; text-align: center; color: var(--muted); }
    .back-note { grid-column: 1 / -1; margin: 0; text-align: center; color: var(--muted); line-height: 1.7; }
    @media (max-width: 800px) {
      .row { grid-template-columns: repeat(2, 1fr); }
      .detail { grid-template-columns: 1fr; }
      .count { margin-left: 0; width: 100%; }
      .back-view { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <h1>第一弹 · 退潮</h1>
    <p class="lead">海洋垃圾收藏册。这些卡不是对战随从，册子里只收图像和趣味文字。同名的卡按稀有度分开计算，这一弹共 50 张。横幅是阔画，竖卡是放进收藏册的平卡。</p>
    <div class="stats">
      <span class="common">普通 <b>${counts.普通}</b></span>
      <span class="rare">稀有 <b>${counts.稀有}</b></span>
      <span class="epic">史诗 <b>${counts.史诗}</b></span>
      <span class="legend">传说 <b>${counts.传说}</b></span>
      <span>阔画 <b>${paintings.length}</b></span>
    </div>
    <div class="bar">
      <button class="tab" type="button" id="showFlat" aria-pressed="true">平卡</button>
      <button class="tab" type="button" id="showWide" aria-pressed="false">阔画</button>
      <button class="tab" type="button" id="showBack" aria-pressed="false">卡背</button>
      <button type="button" data-filter="全部" aria-pressed="true">全部</button>
      <button type="button" data-filter="普通">普通</button>
      <button type="button" data-filter="稀有">稀有</button>
      <button type="button" data-filter="史诗">史诗</button>
      <button type="button" data-filter="传说">传说</button>
      <span class="count" id="count"></span>
    </div>
  </header>
  <main>
    <div id="flatView">${cardHtml}</div>
    <div id="wideView" class="wides" hidden>${wideHtml}</div>
    <div id="backView" class="back-view" hidden>
      <figure>
        <img src="flat/OG-001.png" alt="塑料瓶普通平卡正面">
        <figcaption>正面 · 塑料瓶</figcaption>
      </figure>
      <figure>
        <img src="back/tide-1.png" alt="退潮卡背">
        <figcaption>卡背 · 整套共用</figcaption>
      </figure>
      <p class="back-note">整套五十张共用这一张背面。纹章是那枚还没找到的瓶盖，翻开之前看不出稀有度。</p>
    </div>
  </main>
  <dialog id="detail">
    <div class="detail">
      <img id="flatImg" alt="">
      <div>
        <img id="wideImg" alt="">
        <h3 id="dName"></h3>
        <p class="meta" id="dMeta"></p>
        <p class="flavor" id="dFlavor"></p>
        <button class="close" type="button" id="closeDetail">合上</button>
      </div>
    </div>
  </dialog>
  <script>
    const cards = ${JSON.stringify(catalog)};
    const byId = Object.fromEntries(cards.map((card) => [card.id, card]));
    const flatView = document.getElementById("flatView");
    const wideView = document.getElementById("wideView");
    const backView = document.getElementById("backView");
    const count = document.getElementById("count");
    let filter = "全部";
    let mode = "flat";

    function apply() {
      const buttons = [...document.querySelectorAll(".card")];
      let shown = 0;
      for (const button of buttons) {
        const visible = filter === "全部" || button.dataset.rarity === filter;
        button.hidden = !visible;
        if (visible) shown += 1;
      }
      for (const group of document.querySelectorAll(".group")) {
        const groupCards = [...group.querySelectorAll(".card")];
        const shownCards = groupCards.filter((card) => !card.hidden);
        group.hidden = shownCards.length === 0;
        const label = group.querySelector("h2 span");
        label.textContent = filter === "全部" ? groupCards.length + " 张" : shownCards.length + " / " + groupCards.length;
      }
      for (const figure of document.querySelectorAll(".wide")) {
        figure.hidden = filter !== "全部" && !figure.dataset.rarities.split(" ").includes(filter);
      }
      const wideShown = [...document.querySelectorAll(".wide")].filter((figure) => !figure.hidden).length;
      if (mode === "back") count.textContent = "卡背 1";
      else if (mode === "flat") count.textContent = "平卡 " + shown + " / " + buttons.length;
      else count.textContent = "阔画 " + wideShown + " / " + document.querySelectorAll(".wide").length;
    }

    function setMode(next) {
      mode = next;
      flatView.hidden = mode !== "flat";
      wideView.hidden = mode !== "wide";
      backView.hidden = mode !== "back";
      document.getElementById("showFlat").setAttribute("aria-pressed", String(mode === "flat"));
      document.getElementById("showWide").setAttribute("aria-pressed", String(mode === "wide"));
      document.getElementById("showBack").setAttribute("aria-pressed", String(mode === "back"));
      apply();
    }
    document.getElementById("showFlat").addEventListener("click", () => setMode("flat"));
    document.getElementById("showWide").addEventListener("click", () => setMode("wide"));
    document.getElementById("showBack").addEventListener("click", () => setMode("back"));
    for (const button of document.querySelectorAll("[data-filter]")) {
      button.addEventListener("click", () => {
        filter = button.dataset.filter;
        for (const item of document.querySelectorAll("[data-filter]")) {
          item.setAttribute("aria-pressed", String(item === button));
        }
        apply();
      });
    }
    const dialog = document.getElementById("detail");
    flatView.addEventListener("click", (event) => {
      const button = event.target.closest(".card");
      if (!button) return;
      const card = byId[button.dataset.id];
      document.getElementById("flatImg").src = card.flat;
      document.getElementById("flatImg").alt = card.name + "平卡";
      document.getElementById("wideImg").src = card.painting;
      document.getElementById("wideImg").alt = card.name + "阔画";
      document.getElementById("dName").textContent = card.name;
      document.getElementById("dMeta").textContent = card.id + " · " + card.rarity;
      document.getElementById("dFlavor").innerHTML = card.lines.map((line) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;")).join("<br>");
      dialog.showModal();
    });
    document.getElementById("closeDetail").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    apply();
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf8");
}

async function main() {
  registerFonts();
  const { cards, counts } = buildCards();
  const paintings = buildPaintings(cards);
  const only = process.argv.includes("--only")
    ? process.argv[process.argv.indexOf("--only") + 1].split(",")
    : null;

  fs.mkdirSync(path.join(ROOT, "art"), { recursive: true });
  fs.mkdirSync(path.join(ROOT, "flat"), { recursive: true });

  const needed = new Set((only ? cards.filter((card) => only.includes(card.id)) : cards).map((card) => card.art));
  const missing = [];
  for (const id of needed) {
    const file = SOURCES[id];
    const src = path.join(ASSET_DIR, file);
    if (!file || !fs.existsSync(src)) missing.push(`${id} <- ${file || "未登记"}`);
    else fs.copyFileSync(src, path.join(ROOT, "art", `${id}.jpg`));
  }
  if (missing.length) {
    throw new Error("缺少阔画：\n" + missing.join("\n"));
  }

  const cache = new Map();
  const selected = only ? cards.filter((card) => only.includes(card.id)) : cards;
  for (const card of selected) {
    if (!cache.has(card.art)) cache.set(card.art, await loadImage(path.join(ROOT, "art", `${card.art}.jpg`)));
    const canvas = drawCard(card, cache.get(card.art));
    const out = path.join(ROOT, "flat", `${card.id}.png`);
    fs.writeFileSync(out, canvas.toBuffer("image/png"));
    console.log(card.id, card.name, card.rarity);
  }

  if (!only) {
    for (const painting of paintings) {
      const srcName = SOURCES[painting.id];
      const src = path.join(ASSET_DIR, srcName);
      if (!fs.existsSync(src)) throw new Error(`缺少阔画 ${painting.id}`);
      fs.copyFileSync(src, path.join(ROOT, "art", `${painting.id}.jpg`));
    }
    fs.writeFileSync(
      path.join(ROOT, "cards.json"),
      JSON.stringify(
        {
          setId: "tide-1",
          setName: "退潮",
          wave: 1,
          theme: "海洋垃圾",
          kind: "收藏品",
          counts,
          cards,
          paintings,
        },
        null,
        2
      ),
      "utf8"
    );
    writeGallery(cards, paintings, counts);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
