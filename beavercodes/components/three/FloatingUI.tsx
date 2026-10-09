"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, Group, MeshBasicMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3 } from "three";
import { sceneState } from "@/utils/sceneState";
import { range, smoothstep } from "@/utils/math";

/**
 * Glassy interface cards that drift around the workspace while the beaver
 * builds — a deploy toast, a component snippet, a palette, a phone screen,
 * a performance score, a commit. They materialise during the approach,
 * respond to the cursor with depth parallax, and dissolve before the dive.
 */

type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const ACCENT = "#ff7a1a";
const INK = "#0c0a09";
const CREAM = "#f2ebe1";
const MUTE = "#a39789";

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function card(paint: Paint) {
  const w = 512;
  const h = 320;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  // Glass body
  rr(ctx, 4, 4, w - 8, h - 8, 28);
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(40,32,27,0.82)");
  g.addColorStop(1, "rgba(18,14,12,0.78)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,190,140,0.28)";
  ctx.stroke();
  // Top sheen
  const sheen = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  sheen.addColorStop(0, "rgba(255,255,255,0.08)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  rr(ctx, 4, 4, w - 8, h * 0.5, 28);
  ctx.fill();
  paint(ctx, w, h);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const CARDS: Array<{ pos: [number, number, number]; size: number; depth: number; paint: Paint }> = [
  {
    pos: [-0.62, 1.22, -0.12],
    size: 0.2,
    depth: 1,
    paint: (ctx) => {
      ctx.fillStyle = "#2bd576";
      ctx.beginPath();
      ctx.arc(60, 80, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.font = "bold 24px ui-sans-serif, system-ui";
      ctx.fillText("✓", 51, 89);
      ctx.fillStyle = CREAM;
      ctx.font = "700 30px ui-sans-serif, system-ui";
      ctx.fillText("Deployed to production", 96, 90);
      ctx.fillStyle = MUTE;
      ctx.font = "22px ui-monospace, Menlo, monospace";
      ctx.fillText("beavercodes.com · 1.2s", 96, 128);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      rr(ctx, 40, 180, 432, 14, 7);
      ctx.fill();
      ctx.fillStyle = ACCENT;
      rr(ctx, 40, 180, 432, 14, 7);
      ctx.fill();
      ctx.fillStyle = MUTE;
      ctx.font = "20px ui-monospace, Menlo, monospace";
      ctx.fillText("build  ✓   tests  ✓   edge  ✓", 40, 250);
    },
  },
  {
    pos: [0.58, 1.3, -0.2],
    size: 0.21,
    depth: 0.6,
    paint: (ctx) => {
      ctx.font = "24px ui-monospace, Menlo, monospace";
      const lines: Array<Array<[string, string]>> = [
        [["<", MUTE], ["Button", "#ffb35c"]],
        [["  variant", CREAM], ["=", ACCENT], ['"ember"', "#e7c08a"]],
        [["  size", CREAM], ["=", ACCENT], ['"lg"', "#e7c08a"]],
        [["  onClick", CREAM], ["=", ACCENT], ["{grow}", "#d99a6c"]],
        [["/>", MUTE]],
      ];
      lines.forEach((l, i) => {
        let x = 44;
        l.forEach(([t, c]) => {
          ctx.fillStyle = c;
          ctx.fillText(t, x, 74 + i * 44);
          x += ctx.measureText(t).width;
        });
      });
    },
  },
  {
    pos: [-0.44, 1.48, 0.12],
    size: 0.15,
    depth: 1.4,
    paint: (ctx) => {
      ctx.fillStyle = MUTE;
      ctx.font = "600 20px ui-monospace, Menlo, monospace";
      ctx.fillText("BRAND PALETTE", 44, 66);
      ["#ff7a1a", "#ffb35c", "#f2ebe1", "#7a4a2b", "#1c1815"].forEach((c, i) => {
        ctx.fillStyle = c;
        rr(ctx, 44 + i * 86, 104, 70, 150, 18);
        ctx.fill();
      });
    },
  },
  {
    pos: [0.74, 1.05, 0.18],
    size: 0.13,
    depth: 1.2,
    paint: (ctx, w) => {
      // A phone screen, laid out wide
      ctx.fillStyle = MUTE;
      ctx.font = "600 20px ui-monospace, Menlo, monospace";
      ctx.fillText("MOBILE · iOS / ANDROID", 44, 66);
      ctx.fillStyle = "#1f1a17";
      rr(ctx, w / 2 - 70, 92, 140, 196, 22);
      ctx.fill();
      ctx.fillStyle = ACCENT;
      rr(ctx, w / 2 - 56, 110, 112, 70, 12);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      for (let i = 0; i < 3; i++) {
        rr(ctx, w / 2 - 56, 192 + i * 30, 112, 20, 8);
        ctx.fill();
      }
    },
  },
  {
    pos: [-0.78, 0.98, 0.3],
    size: 0.14,
    depth: 0.8,
    paint: (ctx) => {
      ctx.lineWidth = 16;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(128, 160, 78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#2bd576";
      ctx.beginPath();
      ctx.arc(128, 160, 78, -Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();
      ctx.fillStyle = CREAM;
      ctx.font = "800 54px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText("100", 128, 178);
      ctx.textAlign = "left";
      ctx.font = "700 30px ui-sans-serif, system-ui";
      ctx.fillText("Performance", 248, 140);
      ctx.fillStyle = MUTE;
      ctx.font = "22px ui-monospace, Menlo, monospace";
      ctx.fillText("Core Web Vitals ✓", 248, 184);
    },
  },
  {
    pos: [0.36, 1.56, 0.05],
    size: 0.15,
    depth: 1.6,
    paint: (ctx) => {
      ctx.font = "24px ui-monospace, Menlo, monospace";
      ctx.fillStyle = ACCENT;
      ctx.fillText("$", 44, 90);
      ctx.fillStyle = CREAM;
      ctx.fillText('git commit -m "ship it"', 70, 90);
      ctx.fillStyle = MUTE;
      ctx.fillText("[main 8f3c2a1] ship it", 44, 140);
      ctx.fillText(" 12 files changed", 44, 182);
      ctx.fillStyle = "#2bd576";
      ctx.fillText(" +482", 44, 224);
      ctx.fillStyle = "#ff8a7a";
      ctx.fillText(" -97", 140, 224);
    },
  },
];

export default function FloatingUI({ count = CARDS.length }: { count?: number }) {
  const group = useRef<Group>(null);
  const camera = useThree((s) => s.camera);

  const items = useMemo(
    () =>
      CARDS.slice(0, count).map((c, i) => ({
        ...c,
        mat: new MeshBasicMaterial({ map: card(c.paint), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
        geo: new PlaneGeometry(c.size * 1.6, c.size),
        delay: i * 0.025,
        phase: i * 1.7,
      })),
    [count],
  );

  useEffect(
    () => () => {
      items.forEach((it) => {
        it.mat.map?.dispose();
        it.mat.dispose();
        it.geo.dispose();
      });
    },
    [items],
  );

  const tmp = useMemo(() => ({ q: new Quaternion(), look: new Vector3() }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = sceneState.p;
    const out = 1 - smoothstep(range(p, 0.48, 0.6));
    group.current?.children.forEach((mesh, i) => {
      const it = items[i];
      const appear = smoothstep(range(p, 0.04 + it.delay, 0.18 + it.delay));
      const [x, y, z] = it.pos;
      mesh.position.set(
        x + sceneState.px * 0.05 * it.depth,
        y + Math.sin(t * 0.6 + it.phase) * 0.018 + (1 - appear) * -0.06 + sceneState.py * 0.03 * it.depth,
        z,
      );
      // Ease toward facing the camera, so cards feel placed, not billboarded.
      mesh.lookAt(tmp.look.copy(camera.position));
      mesh.rotateY(Math.sin(t * 0.4 + it.phase) * 0.12);
      it.mat.opacity = appear * out * 0.95;
      mesh.visible = it.mat.opacity > 0.005;
      const s = 0.85 + appear * 0.15;
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} geometry={it.geo} material={it.mat} renderOrder={4} />
      ))}
    </group>
  );
}
