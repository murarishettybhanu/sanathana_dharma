/**
 * Palette-quantising PNG optimiser — no native dependencies.
 *
 * The Trust's mark is flat illustration: a few dozen greens, browns, blues and
 * sands, plus antialiased edges. `sips` re-encodes it as 24-bit truecolour,
 * which is wasteful for that kind of image — the 256px navbar logo came out at
 * 116 kB. Median-cut down to an indexed palette and it lands around a fifth of
 * that, with no visible difference at the sizes the UI actually uses.
 *
 * Usage: node scripts/optimise-png.mjs <file...> [--colors 128]
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import zlib from 'node:zlib';

/* ------------------------------------------------------------------ decode */

function decodePng(path) {
  const buf = readFileSync(path);
  let pos = 8;
  let width, height, bitDepth, colorType;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`unsupported PNG: bitDepth=${bitDepth} colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = v & 0xff;
    }
  }

  // Normalise to RGBA so the rest of the pipeline has one shape to handle.
  if (channels === 3) {
    const rgba = Buffer.alloc(width * height * 4, 255);
    for (let i = 0, j = 0; i < out.length; i += 3, j += 4) {
      rgba[j] = out[i]; rgba[j + 1] = out[i + 1]; rgba[j + 2] = out[i + 2];
    }
    return { width, height, data: rgba };
  }
  return { width, height, data: out };
}

/* ---------------------------------------------------------------- quantise */

/** Median cut over the RGBA cube, splitting the box with the widest channel. */
function medianCut(pixels, maxColors) {
  let boxes = [pixels];

  while (boxes.length < maxColors) {
    // Split the box with the greatest spread; stop when none can be split.
    let target = -1;
    let bestRange = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].length < 2) continue;
      const r = channelRange(boxes[i]);
      if (r.range > bestRange) { bestRange = r.range; target = i; }
    }
    if (target < 0 || bestRange === 0) break;

    const box = boxes[target];
    const { channel } = channelRange(box);
    box.sort((a, b) => a[channel] - b[channel]);
    const mid = box.length >> 1;
    boxes.splice(target, 1, box.slice(0, mid), box.slice(mid));
  }

  return boxes.filter((b) => b.length).map((box) => {
    const sum = [0, 0, 0, 0];
    for (const p of box) for (let c = 0; c < 4; c++) sum[c] += p[c];
    return sum.map((v) => Math.round(v / box.length));
  });
}

function channelRange(box) {
  const min = [255, 255, 255, 255];
  const max = [0, 0, 0, 0];
  for (const p of box) {
    for (let c = 0; c < 4; c++) {
      if (p[c] < min[c]) min[c] = p[c];
      if (p[c] > max[c]) max[c] = p[c];
    }
  }
  // Weight alpha heavily: collapsing distinct alphas shows as a ragged edge.
  const spreads = [max[0] - min[0], max[1] - min[1], max[2] - min[2], (max[3] - min[3]) * 2];
  let channel = 0;
  for (let c = 1; c < 4; c++) if (spreads[c] > spreads[channel]) channel = c;
  return { channel, range: spreads[channel] };
}

/* ----------------------------------------------------------------- encode */

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodeIndexed(width, height, indices, palette) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 3;   // colour type: indexed
  ihdr[12] = 0;  // no interlace

  const plte = Buffer.alloc(palette.length * 3);
  const trns = Buffer.alloc(palette.length);
  palette.forEach((c, i) => {
    plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2];
    trns[i] = c[3];
  });

  // One filter byte per scanline. Filter 0 (None) is best for indexed data:
  // the other filters operate on palette indices, which are not a gradient.
  const raw = Buffer.alloc(height * (width + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0;
    indices.copy(raw, y * (width + 1) + 1, y * width, (y + 1) * width);
  }

  const chunks = [
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('PLTE', plte),
  ];
  // tRNS is only needed when something is actually transparent.
  if (trns.some((a) => a < 255)) chunks.push(chunk('tRNS', trns));
  chunks.push(chunk('IDAT', zlib.deflateSync(raw, { level: 9 })));
  chunks.push(chunk('IEND', Buffer.alloc(0)));
  return Buffer.concat(chunks);
}

/* ------------------------------------------------------------------- main */

const args = process.argv.slice(2);
const colorArg = args.indexOf('--colors');
const maxColors = colorArg >= 0 ? Number(args[colorArg + 1]) : 128;
const files = args.filter((a, i) => !a.startsWith('--') && i !== colorArg + 1);

for (const file of files) {
  const before = statSync(file).size;
  const { width, height, data } = decodePng(file);

  // Unique colours first — median cut on 1M duplicate pixels is pointless.
  const seen = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
    if (!seen.has(key)) seen.set(key, [data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }
  const unique = [...seen.values()];
  const palette = unique.length <= maxColors ? unique : medianCut(unique, maxColors);

  // Map every pixel to its nearest palette entry, caching by exact colour.
  const cache = new Map();
  const indices = Buffer.alloc(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const key = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
    let idx = cache.get(key);
    if (idx === undefined) {
      let best = 0, bestDist = Infinity;
      for (let c = 0; c < palette.length; c++) {
        const pc = palette[c];
        const da = (data[i + 3] - pc[3]) * 3; // alpha mismatch is most visible
        const dr = data[i] - pc[0], dg = data[i + 1] - pc[1], db = data[i + 2] - pc[2];
        const dist = dr * dr + dg * dg + db * db + da * da;
        if (dist < bestDist) { bestDist = dist; best = c; }
      }
      idx = best;
      cache.set(key, idx);
    }
    indices[p] = idx;
  }

  const out = encodeIndexed(width, height, indices, palette);
  if (out.length < before) {
    writeFileSync(file, out);
    const pct = Math.round((1 - out.length / before) * 100);
    console.log(
      `  ${file.padEnd(38)} ${String(Math.round(before / 1024)).padStart(5)} KB → ` +
        `${String(Math.round(out.length / 1024)).padStart(4)} KB  (−${pct}%, ${palette.length} colours)`,
    );
  } else {
    console.log(`  ${file.padEnd(38)} left as-is (already smaller)`);
  }
}
