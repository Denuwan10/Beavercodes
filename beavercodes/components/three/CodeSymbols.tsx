"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Sprite, SpriteMaterial } from "three";
import { sceneState } from "@/utils/sceneState";
import { range, smoothstep } from "@/utils/math";
import { makeGlyphTexture } from "./ScreenTexture";

const GLYPHS = ["</>", "{ }", "=>", "( )", "[ ]", "&&", "fn", "01", "#", "::", "<div>", "npm", "git", "λ", "async", "∞", "++", "?."];

/**
 * Code glyphs that softly materialise around the workspace during 0–20% and
 * drift with the camera — the "digital workshop" atmosphere.
 */
export default function CodeSymbols({ count }: { count: number }) {
  const group = useRef<Group>(null);

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + (i % 3) * 0.4;
      const r = 0.75 + ((i * 7) % 5) * 0.14;
      return {
        glyph: GLYPHS[i % GLYPHS.length],
        x: Math.cos(a) * r,
        y: 0.95 + ((i * 11) % 7) * 0.11,
        z: Math.sin(a) * r * 0.85 + 0.15,
        delay: (i % 6) / 6,
        speed: 0.4 + ((i * 3) % 5) * 0.08,
        size: 0.055 + (i % 4) * 0.012,
      };
    });
  }, [count]);

  const materials = useMemo(
    () =>
      items.map(
        (it) =>
          new SpriteMaterial({
            map: makeGlyphTexture(it.glyph, it.glyph.length > 2 ? "#ffcf96" : "#ffb35c"),
            transparent: true,
            depthWrite: false,
            opacity: 0,
          }),
      ),
    [items],
  );

  useEffect(
    () => () => {
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    },
    [materials],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = sceneState.p;
    const fadeOut = 1 - range(p, 0.5, 0.62);
    group.current?.children.forEach((child, i) => {
      const it = items[i];
      const appear = smoothstep(range(p, 0.03 + it.delay * 0.12, 0.12 + it.delay * 0.12));
      const s = child as Sprite;
      s.position.set(it.x, it.y + Math.sin(t * it.speed + i) * 0.03, it.z);
      materials[i].opacity = appear * fadeOut * (0.35 + Math.sin(t * it.speed * 1.7 + i) * 0.12);
      const sc = it.size * (0.7 + appear * 0.3);
      s.scale.set(sc * 2, sc, 1);
    });
  });

  return (
    <group ref={group}>
      {materials.map((m, i) => (
        <sprite key={i} material={m} />
      ))}
    </group>
  );
}
