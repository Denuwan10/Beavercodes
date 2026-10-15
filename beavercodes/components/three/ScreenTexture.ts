import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

/**
 * The laptop display is a 2D canvas painted at ~12 fps and uploaded as a
 * texture: a code editor that types itself, and — as the story progresses —
 * floating previews of websites, apps and dashboards the beaver is building.
 * Cheap to render, crisp at close range, and needs no network assets.
 */

type Tok = [string, string];

const C = {
  bg: "#0f0d0c",
  panel: "#171412",
  line: "rgba(242,235,225,0.07)",
  text: "#e9e1d6",
  mute: "#6f665d",
  kw: "#ff8a3d",
  str: "#e7c08a",
  fn: "#f2ebe1",
  tag: "#ffb35c",
  num: "#d99a6c",
  com: "#5f574f",
};

const CODE: Tok[][] = [
  [["// beaver.build() — crafting your digital future", C.com]],
  [["import", C.kw], [" { Workshop, Studio } ", C.text], ["from", C.kw], [" '@beavercodes/core'", C.str]],
  [],
  [["export default function", C.kw], [" Hero", C.fn], ["() {", C.text]],
  [["  const", C.kw], [" growth ", C.text], ["=", C.kw], [" useBusiness", C.fn], ["({ ", C.text], ["goal", C.text], [": ", C.text], ["'scale'", C.str], [" })", C.text]],
  [],
  [["  return", C.kw], [" (", C.text]],
  [["    <", C.mute], ["Workshop", C.tag], [" theme", C.text], ["=", C.kw], ['"ember"', C.str], [">", C.mute]],
  [["      <", C.mute], ["Headline", C.tag], [">", C.mute], ["Your Business Deserves", C.text]],
  [["        A Stronger Digital Future", C.text], ["</", C.mute], ["Headline", C.tag], [">", C.mute]],
  [["      <", C.mute], ["Services", C.tag], [" items", C.text], ["=", C.kw], ["{", C.text], ["4", C.num], ["}", C.text], [" />", C.mute]],
  [["      <", C.mute], ["Stats", C.tag], [" projects", C.text], ["=", C.kw], ["{", C.text], ["50", C.num], ["}", C.text], [" clients", C.text], ["=", C.kw], ["{", C.text], ["30", C.num], ["}", C.text], [" />", C.mute]],
  [["    </", C.mute], ["Workshop", C.tag], [">", C.mute]],
  [["  )", C.text]],
  [["}", C.text]],
  [],
  [["// build • develop • grow", C.com]],
];

const TOTAL_CHARS = CODE.reduce((n, l) => n + l.reduce((m, t) => m + t[0].length, 0) + 1, 0);

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export class ScreenCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly texture: CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private W: number;
  private H: number;

  constructor(width = 1280, height = 800) {
    this.W = width;
    this.H = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.minFilter = LinearFilter;
    this.texture.generateMipmaps = false;
    this.texture.anisotropy = 4;
  }

  /**
   * @param time seconds
   * @param ui   0 → 1, how much of the "product previews" layer is visible
   */
  draw(time: number, ui: number) {
    const { ctx, W, H } = this;
    const s = W / 1280;
    ctx.save();
    ctx.scale(s, s);
    const w = 1280;
    const h = H / s;

    // Base
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Window chrome
    ctx.fillStyle = C.panel;
    ctx.fillRect(0, 0, w, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(26 + i * 22, 22, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "500 15px ui-monospace, Menlo, monospace";
    const tabs = ["Hero.tsx", "Services.tsx", "beaver.config.ts"];
    tabs.forEach((t, i) => {
      const x = 110 + i * 168;
      if (i === 0) {
        ctx.fillStyle = C.bg;
        ctx.fillRect(x, 6, 158, 38);
        ctx.fillStyle = C.kw;
        ctx.fillRect(x, 6, 158, 2);
      }
      ctx.fillStyle = i === 0 ? C.text : C.mute;
      ctx.fillText(t, x + 18, 31);
    });

    // Sidebar
    ctx.fillStyle = "#121010";
    ctx.fillRect(0, 44, 220, h - 44);
    ctx.fillStyle = C.mute;
    ctx.font = "600 12px ui-monospace, Menlo, monospace";
    ctx.fillText("EXPLORER", 22, 76);
    const files = ["app/", "  page.tsx", "  layout.tsx", "components/", "  Hero.tsx", "  Services.tsx", "  Portfolio.tsx", "  Contact.tsx", "three/", "  Beaver.tsx", "  Laptop.tsx"];
    ctx.font = "14px ui-monospace, Menlo, monospace";
    files.forEach((f, i) => {
      const active = f.trim() === "Hero.tsx";
      if (active) {
        ctx.fillStyle = "rgba(255,122,26,0.12)";
        ctx.fillRect(0, 94 + i * 30, 220, 28);
      }
      ctx.fillStyle = active ? C.text : f.endsWith("/") ? "#8d8378" : C.mute;
      ctx.fillText(f, 22, 113 + i * 30);
    });

    // Code — types itself on a ~14s loop, holds, then restarts
    const cycle = 16;
    const t = time % cycle;
    const typed = Math.floor(Math.min(1, t / 11) * TOTAL_CHARS);
    ctx.font = "17px ui-monospace, Menlo, monospace";
    const lineH = 30;
    let remaining = typed;
    let caretX = 0;
    let caretY = 0;
    const codeX = 300;
    const codeY = 92;
    for (let i = 0; i < CODE.length; i++) {
      const y = codeY + i * lineH;
      ctx.fillStyle = "#4a433d";
      ctx.textAlign = "right";
      ctx.fillText(String(i + 1), 268, y);
      ctx.textAlign = "left";
      let x = codeX;
      for (const [text, color] of CODE[i]) {
        if (remaining <= 0) break;
        const part = text.slice(0, remaining);
        remaining -= part.length;
        ctx.fillStyle = color;
        ctx.fillText(part, x, y);
        x += ctx.measureText(part).width;
      }
      if (remaining > 0) {
        remaining -= 1; // newline
        caretX = codeX;
        caretY = y + lineH;
      } else {
        caretX = x;
        caretY = y;
        break;
      }
    }
    if (Math.floor(time * 2) % 2 === 0 || t < 11) {
      ctx.fillStyle = C.kw;
      ctx.fillRect(caretX + 2, caretY - 17, 2.5, 22);
    }

    // Status bar
    ctx.fillStyle = "#ff7a1a";
    ctx.fillRect(0, h - 30, w, 30);
    ctx.fillStyle = "#0c0a09";
    ctx.font = "600 13px ui-monospace, Menlo, monospace";
    ctx.fillText("◆ beavercodes/main   ✓ build passing   ⟳ live preview", 18, h - 10);

    // Product previews layer
    if (ui > 0.001) this.drawPreviews(time, ui, w, h);

    ctx.restore();
    this.texture.needsUpdate = true;
  }

  private drawPreviews(time: number, ui: number, w: number, h: number) {
    const { ctx } = this;
    // Dim the editor beneath
    ctx.fillStyle = `rgba(12,10,9,${0.55 * ui})`;
    ctx.fillRect(0, 44, w, h - 74);

    const ease = (k: number) => {
      const v = Math.min(1, Math.max(0, (ui - k * 0.18) / 0.55));
      return 1 - Math.pow(1 - v, 3);
    };

    // 1 — Website preview card
    const a = ease(0);
    if (a > 0) {
      ctx.save();
      ctx.globalAlpha = a;
      const x = 560 + (1 - a) * 120;
      const y = 92;
      const cw = 470;
      const ch = 300;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 40;
      ctx.fillStyle = "#f2ebe1";
      roundRect(ctx, x, y, cw, ch, 14);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#e3d9cc";
      roundRect(ctx, x, y, cw, 30, 14);
      ctx.fill();
      ctx.fillRect(x, y + 16, cw, 14);
      ctx.fillStyle = "#0c0a09";
      ctx.font = "700 30px ui-sans-serif, system-ui";
      ctx.fillText("Grow online.", x + 28, y + 96);
      ctx.fillStyle = "#ff7a1a";
      ctx.font = "700 30px ui-sans-serif, system-ui";
      ctx.fillText("beautifully.", x + 28, y + 132);
      ctx.fillStyle = "#0c0a09";
      roundRect(ctx, x + 28, y + 158, 120, 34, 17);
      ctx.fill();
      ctx.fillStyle = "#cfc3b4";
      for (let i = 0; i < 3; i++) {
        roundRect(ctx, x + 28 + i * 145, y + 214, 130, 62, 8);
        ctx.fill();
      }
      ctx.fillStyle = "#ff7a1a";
      roundRect(ctx, x + 300, y + 60, 140, 128, 12);
      ctx.fill();
      ctx.restore();
    }

    // 2 — Mobile app mock
    const b = ease(1);
    if (b > 0) {
      ctx.save();
      ctx.globalAlpha = b;
      const x = 1060 + (1 - b) * 100;
      const y = 120 + Math.sin(time * 1.3) * 4;
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "#1f1a17";
      roundRect(ctx, x, y, 170, 340, 26);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ff7a1a";
      roundRect(ctx, x + 12, y + 14, 146, 120, 16);
      ctx.fill();
      ctx.fillStyle = "#0c0a09";
      ctx.font = "800 22px ui-sans-serif, system-ui";
      ctx.fillText("$24.8k", x + 26, y + 70);
      ctx.font = "13px ui-sans-serif, system-ui";
      ctx.fillText("revenue this week", x + 26, y + 94);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i === 1 ? "#ffb35c" : "#2a2420";
        roundRect(ctx, x + 12, y + 148 + i * 46, 146, 38, 10);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3 — Dashboard chart
    const c = ease(2);
    if (c > 0) {
      ctx.save();
      ctx.globalAlpha = c;
      const x = 560 + (1 - c) * 80;
      const y = 418;
      const cw = 470;
      const ch = 250;
      ctx.fillStyle = "#1a1613";
      roundRect(ctx, x, y, cw, ch, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(242,235,225,0.08)";
      ctx.stroke();
      ctx.fillStyle = "#a39789";
      ctx.font = "600 13px ui-monospace, Menlo, monospace";
      ctx.fillText("BUSINESS GROWTH", x + 24, y + 34);
      const bars = [0.35, 0.42, 0.4, 0.55, 0.62, 0.6, 0.74, 0.86, 0.94];
      bars.forEach((v, i) => {
        const grow = Math.min(1, c * 1.4 - i * 0.04);
        const bh = Math.max(0, v * 150 * grow);
        ctx.fillStyle = i === bars.length - 1 ? "#ff7a1a" : "#3a312b";
        roundRect(ctx, x + 26 + i * 48, y + ch - 28 - bh, 32, bh, 6);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  dispose() {
    this.texture.dispose();
  }
}

/** Small glyph sprites ("</>", "{ }", "=>"...) used for floating code symbols. */
export function makeGlyphTexture(glyph: string, color = "#ffb35c") {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size * 2;
  c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.font = "600 76px ui-monospace, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.fillText(glyph, size, size / 2 + 4);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/** Width ÷ height of the back-of-monitor logo texture (matches the mascot art). */
export const LID_LOGO_ASPECT = 661 / 395;

/**
 * Back-of-monitor logo — the BeaverCodes mascot on a soft warm halo, seen in
 * the wide shot. The artwork streams in; the halo shows until it arrives.
 */
export function makeLidLogoTexture() {
  const c = document.createElement("canvas");
  c.height = 256;
  c.width = Math.round(256 * LID_LOGO_ASPECT);
  const ctx = c.getContext("2d")!;
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;

  const halo = () => {
    const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 10, c.width / 2, c.height / 2, c.width / 2);
    g.addColorStop(0, "rgba(255,150,70,0.35)");
    g.addColorStop(1, "rgba(255,122,26,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
  };
  halo();

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    halo();
    const pad = 18;
    ctx.drawImage(img, pad, pad, c.width - pad * 2, c.height - pad * 2);
    tex.needsUpdate = true;
  };
  img.src = "/brand/beaver-mark.png";
  return tex;
}
