const fs = require('fs');
const path = require('path');
const { deflateSync } = require('zlib');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function createPNG(size, paint) {
  const pixels = new Uint8Array(size * size * 4);
  paint(pixels, size);
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = (size * 4 + 1) * y;
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const o = row + 1 + x * 4;
      raw[o] = pixels[i];
      raw[o + 1] = pixels[i + 1];
      raw[o + 2] = pixels[i + 2];
      raw[o + 3] = pixels[i + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
}

function set(pixels, size, x, y, r, g, b, a) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  const sa = a / 255;
  const da = pixels[i + 3] / 255;
  const out = sa + da * (1 - sa);
  if (out <= 0) return;
  pixels[i] = Math.round((r * sa + pixels[i] * da * (1 - sa)) / out);
  pixels[i + 1] = Math.round((g * sa + pixels[i + 1] * da * (1 - sa)) / out);
  pixels[i + 2] = Math.round((b * sa + pixels[i + 2] * da * (1 - sa)) / out);
  pixels[i + 3] = Math.round(out * 255);
}

function fillCircle(pixels, size, cx, cy, rad, r, g, b, a) {
  const x0 = Math.max(0, Math.floor(cx - rad - 1));
  const x1 = Math.min(size - 1, Math.ceil(cx + rad + 1));
  const y0 = Math.max(0, Math.floor(cy - rad - 1));
  const y1 = Math.min(size - 1, Math.ceil(cy + rad + 1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rad) {
        const edge = Math.min(1, rad - d);
        set(pixels, size, x, y, r, g, b, Math.round(a * Math.min(1, edge * 1.8)));
      }
    }
  }
}

function fillEllipse(pixels, size, cx, cy, rx, ry, rot, r, g, b, a) {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const reach = Math.max(rx, ry) + 2;
  for (let y = Math.floor(cy - reach); y <= Math.ceil(cy + reach); y++) {
    for (let x = Math.floor(cx - reach); x <= Math.ceil(cx + reach); x++) {
      const dx = x - cx;
      const dy = y - cy;
      const lx = dx * cos + dy * sin;
      const ly = -dx * sin + dy * cos;
      const d = (lx * lx) / (rx * rx) + (ly * ly) / (ry * ry);
      if (d <= 1) {
        const edge = Math.min(1, (1 - d) * 6);
        set(pixels, size, x, y, r, g, b, Math.round(a * edge));
      }
    }
  }
}

const size = 256;
const png = createPNG(size, (pixels) => {
  fillCircle(pixels, size, 128, 132, 108, 20, 92, 96, 255);
  fillCircle(pixels, size, 128, 118, 96, 46, 150, 146, 255);
  fillEllipse(pixels, size, 128, 78, 70, 22, 0, 186, 230, 214, 180);
  fillEllipse(pixels, size, 92, 146, 34, 16, -0.35, 240, 160, 74, 255);
  fillEllipse(pixels, size, 54, 154, 16, 12, 0.7, 240, 160, 74, 255);
  fillCircle(pixels, size, 112, 142, 3.2, 40, 36, 28, 255);
  fillCircle(pixels, size, 168, 108, 7, 214, 69, 69, 255);
  fillCircle(pixels, size, 168, 116, 7, 247, 244, 238, 255);
  fillCircle(pixels, size, 78, 96, 16, 63, 143, 98, 255);
});

const out = path.join(__dirname, '..', 'icon.png');
fs.writeFileSync(out, png);
console.log(out);
