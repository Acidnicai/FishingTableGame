const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

const ROOT = __dirname;
const W = 720;
const H = 1024;
const SOURCE = "C:/Users/lenovo/.cursor/projects/d-Data-IDEAL/assets/tide-card-back.jpg";

const pal = {
  hi: "#f0ddb0",
  mid: "#1a5278",
  lo: "#071625",
  edge: "#040b12",
  banner: "#0c1c2c",
  bannerEdge: "#e7d09a",
};

function registerFonts() {
  const nameOk = GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "CardName");
  if (!nameOk) GlobalFonts.registerFromPath("C:/Windows/Fonts/simhei.ttf", "CardName");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/simkai.ttf", "CardFlavor");
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

function drawCover(ctx, img, dx, dy, dw, dh) {
  const scale = Math.max(dw / img.width, dh / img.height);
  const cw = dw / scale;
  const ch = dh / scale;
  const sx = (img.width - cw) / 2;
  const sy = (img.height - ch) / 2;
  ctx.drawImage(img, sx, sy, cw, ch, dx, dy, dw, dh);
}

function drawSpaced(ctx, text, cx, cy, spacing) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (text.length - 1);
  let x = cx - total / 2;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i += 1) {
    ctx.strokeText(text[i], x, cy);
    ctx.fillText(text[i], x, cy);
    x += widths[i] + spacing;
  }
}

function drawDiamond(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s, y);
  ctx.closePath();
  ctx.fillStyle = pal.hi;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = pal.lo;
  ctx.stroke();
}

function strokeRound(ctx, x, y, w, h, r, color, width) {
  roundedRect(ctx, x, y, w, h, r);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawClasp(ctx, x, y, sx, sy) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(78, 18);
  ctx.lineTo(22, 18);
  ctx.quadraticCurveTo(8, 18, 8, 32);
  ctx.lineTo(8, 88);
  ctx.strokeStyle = "#8a6430";
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.strokeStyle = "#f4e4bc";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(18, 18, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#f7e7c4";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#8a6430";
  ctx.stroke();
  ctx.restore();
}

function drawBack(img) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  roundedRect(ctx, 0, 0, W, H, 42);
  ctx.clip();

  const gold = ctx.createLinearGradient(0, 0, W, H);
  gold.addColorStop(0, "#fff1cc");
  gold.addColorStop(0.18, "#e4c27a");
  gold.addColorStop(0.5, "#a67c3d");
  gold.addColorStop(1, "#5c3d16");
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, W, H);

  roundedRect(ctx, 16, 16, W - 32, H - 32, 32);
  const navy = ctx.createLinearGradient(0, 0, 0, H);
  navy.addColorStop(0, "#16324c");
  navy.addColorStop(0.45, "#07131f");
  navy.addColorStop(1, "#040a12");
  ctx.fillStyle = navy;
  ctx.fill();

  strokeRound(ctx, 24, 24, W - 48, H - 48, 28, "#f0d7a0", 1.5);
  strokeRound(ctx, 32, 32, W - 64, H - 64, 24, "#6e5228", 1);

  const artX = 52;
  const artY = 52;
  const artW = 616;
  const artH = 860;
  ctx.save();
  roundedRect(ctx, artX, artY, artW, artH, 16);
  ctx.clip();
  drawCover(ctx, img, artX, artY, artW, artH);
  const shade = ctx.createLinearGradient(artX, artY, artX, artY + artH);
  shade.addColorStop(0, "rgba(0,0,0,0.18)");
  shade.addColorStop(0.12, "rgba(0,0,0,0)");
  shade.addColorStop(0.82, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = shade;
  ctx.fillRect(artX, artY, artW, artH);
  ctx.restore();

  strokeRound(ctx, artX, artY, artW, artH, 16, "#1a1208", 8);
  strokeRound(ctx, artX, artY, artW, artH, 16, "#f6e6c0", 2);
  strokeRound(ctx, artX + 10, artY + 10, artW - 20, artH - 20, 10, "rgba(246,230,192,0.55)", 1.5);

  drawClasp(ctx, 36, 36, 1, 1);
  drawClasp(ctx, W - 36, 36, -1, 1);
  drawClasp(ctx, 36, H - 36, 1, -1);
  drawClasp(ctx, W - 36, H - 36, -1, -1);
  for (const [x, y] of [
    [54, 54],
    [W - 54, 54],
    [54, H - 54],
    [W - 54, H - 54],
  ]) {
    drawDiamond(ctx, x, y, 6);
  }

  ctx.strokeStyle = "#e7d3a4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(196, 972);
  ctx.lineTo(292, 972);
  ctx.moveTo(428, 972);
  ctx.lineTo(524, 972);
  ctx.stroke();
  ctx.font = "28px CardFlavor";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4e4bc";
  ctx.fillText("退潮", 360, 972);

  strokeRound(ctx, 8, 8, W - 16, H - 16, 36, "#2a1c0c", 3);
  ctx.restore();
  return canvas;
}

async function main() {
  if (!fs.existsSync(SOURCE)) throw new Error("缺少卡背原画");
  registerFonts();
  const artDir = path.join(ROOT, "art");
  const backDir = path.join(ROOT, "back");
  fs.mkdirSync(artDir, { recursive: true });
  fs.mkdirSync(backDir, { recursive: true });
  fs.copyFileSync(SOURCE, path.join(artDir, "card-back.jpg"));
  const img = await loadImage(SOURCE);
  const canvas = drawBack(img);
  fs.writeFileSync(path.join(backDir, "tide-1.png"), canvas.toBuffer("image/png"));

  const dataPath = path.join(ROOT, "cards.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  data.cardBack = {
    id: "tide-1-back",
    name: "退潮",
    wave: 1,
    file: "back/tide-1.png",
    painting: "art/card-back.jpg",
    note: "整套共用这一张卡背，背面不区分稀有度。",
  };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  console.log("back/tide-1.png");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
