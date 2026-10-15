"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, InstancedMesh, MeshStandardMaterial, Object3D, RepeatWrapping, SRGBColorSpace } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

const COLS = 15;
const ROWS = 6; // function row + 5
/** How far the keycaps stand above the case top. */
const CAP_RISE = 0.007;

type Tone = "alpha" | "mod" | "accent";
type Key = { x: number; z: number; w: number; tone: Tone };

/** 75%-style layout centred on the key area. */
function layout(pitch: number): Key[] {
  const keys: Key[] = [];
  const x0 = -((COLS - 1) / 2) * pitch;
  const z0 = -((ROWS - 1) / 2) * pitch;
  for (let r = 0; r < ROWS; r++) {
    const z = z0 + r * pitch;
    if (r === ROWS - 1) {
      // Bottom row: modifiers either side of a long space bar.
      [0, 1, 2].forEach((c) => keys.push({ x: x0 + c * pitch, z, w: 1, tone: "mod" }));
      keys.push({ x: x0 + 7 * pitch, z, w: 6.6, tone: "alpha" });
      [11, 12, 13, 14].forEach((c) => keys.push({ x: x0 + c * pitch, z, w: 1, tone: "mod" }));
      continue;
    }
    for (let c = 0; c < COLS; c++) {
      const edge = c === 0 || c === COLS - 1;
      let tone: Tone = edge || r === 0 ? "mod" : "alpha";
      if (r === 0 && c === 0) tone = "accent"; // Esc
      if (r === 3 && c === COLS - 1) tone = "accent"; // Enter
      keys.push({ x: x0 + c * pitch, z, w: 1, tone });
    }
  }
  return keys;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 64, 6, 128, 64, 128);
  g.addColorStop(0, "rgba(255,150,70,0.9)");
  g.addColorStop(0.5, "rgba(255,122,26,0.22)");
  g.addColorStop(1, "rgba(255,122,26,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Walnut grain for the wrist rest. */
function makeWalnutTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#5b3a24";
  ctx.fillRect(0, 0, 512, 128);
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) {
    const y0 = rnd() * 128, amp = 2 + rnd() * 7, f = 0.006 + rnd() * 0.012, ph = rnd() * 6;
    ctx.strokeStyle = rnd() > 0.5 ? `rgba(30,16,8,${0.12 + rnd() * 0.22})` : `rgba(150,96,58,${0.08 + rnd() * 0.14})`;
    ctx.lineWidth = 0.6 + rnd() * 1.8;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = y0 + Math.sin(x * f + ph) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/**
 * Premium mechanical keyboard with an integrated walnut wrist rest, sized to
 * the beaver: space-grey aluminium case, matte two-tone caps, ember accents, a
 * machined volume knob and a warm underglow.
 *
 * Origin: on the desk, at the centre of the whole footprint (body + rest).
 * The typist sits on +Z: key body at the back, wrist rest at the front.
 *
 * @param width   left–right, metres
 * @param depth   front–back including the wrist rest, metres
 * @param height  case top above the desk, metres (keycaps stand a little above)
 */
export default function PremiumKeyboard({
  shadows,
  width,
  depth,
  height,
  typing = 0.8,
}: {
  shadows: boolean;
  width: number;
  depth: number;
  height: number;
  /** 0 → 1 how often keys are struck. */
  typing?: number;
}) {
  // Proportions: wrist rest ~28% of the depth, a slim gap, the rest is the key body.
  const restD = depth * 0.28;
  const gap = depth * 0.025;
  const bodyD = depth - restD - gap;
  const bodyZ = -depth / 2 + bodyD / 2;
  const restZ = depth / 2 - restD / 2;
  const restH = height * 0.72;
  const bezel = Math.min(width, bodyD) * 0.06;
  const pitch = Math.min((width - bezel * 2) / COLS, (bodyD - bezel * 2) / ROWS);
  const cap = pitch * 0.86;
  const capH = pitch * 0.42;

  const keys = useMemo(() => layout(pitch), [pitch]);
  const groups = useMemo(() => {
    const by: Record<Tone, number[]> = { alpha: [], mod: [], accent: [] };
    keys.forEach((k, i) => by[k.tone].push(i));
    return by;
  }, [keys]);

  const alphaRef = useRef<InstancedMesh>(null);
  const modRef = useRef<InstancedMesh>(null);
  const accentRef = useRef<InstancedMesh>(null);
  const refs: Record<Tone, React.RefObject<InstancedMesh | null>> = { alpha: alphaRef, mod: modRef, accent: accentRef };

  const capGeo = useMemo(() => new RoundedBoxGeometry(cap, capH, cap, 2, cap * 0.16), [cap, capH]);
  // Matte PBT-style caps: the desk lamp's hotspot lands right here, and glossy
  // caps turn cream in it.
  const capMats = useMemo(
    () => ({
      // Very dark values: the lamp's hotspot lifts them a lot (#161514 read beige).
      alpha: new MeshStandardMaterial({ color: "#070706", roughness: 0.96, envMapIntensity: 0.12 }),
      mod: new MeshStandardMaterial({ color: "#1d1b1a", roughness: 0.95, envMapIntensity: 0.12 }),
      accent: new MeshStandardMaterial({ color: "#ff7a1a", emissive: "#ff7a1a", emissiveIntensity: 0.3, roughness: 0.85, envMapIntensity: 0.12 }),
    }),
    [],
  );
  const glow = useMemo(() => makeGlowTexture(), []);
  const walnut = useMemo(() => makeWalnutTexture(), []);
  useEffect(
    () => () => {
      capGeo.dispose();
      Object.values(capMats).forEach((m) => m.dispose());
      glow.dispose();
      walnut.dispose();
    },
    [capGeo, capMats, glow, walnut],
  );

  const press = useRef(new Float32Array(keys.length));
  const tmp = useMemo(() => new Object3D(), []);
  // Caps sit in the plate: their tops stand CAP_RISE above the case top.
  const capY = height + CAP_RISE - capH / 2;

  const place = (tone: Tone, slot: number, i: number, depthPx: number) => {
    const mesh = refs[tone].current;
    if (!mesh) return;
    const k = keys[i];
    tmp.position.set(k.x, capY - depthPx, bodyZ + k.z);
    tmp.scale.set(k.w === 1 ? 1 : (k.w * pitch - (pitch - cap)) / cap, 1, 1);
    tmp.updateMatrix();
    mesh.setMatrixAt(slot, tmp.matrix);
  };

  // Lay out every cap.
  useEffect(() => {
    (Object.keys(groups) as Tone[]).forEach((tone) => {
      groups[tone].forEach((i, slot) => place(tone, slot, i, 0));
      const mesh = refs[tone].current;
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, capY, bodyZ]);

  // Keys dip under the paws: a random letter key every so often.
  useFrame((_, dt) => {
    const p = press.current;
    if (typing > 0 && Math.random() < typing * dt * 18) {
      const pool = groups.alpha;
      p[pool[Math.floor(Math.random() * pool.length)]] = 1;
    }
    (Object.keys(groups) as Tone[]).forEach((tone) => {
      let dirty = false;
      groups[tone].forEach((i, slot) => {
        if (p[i] <= 0) return;
        p[i] = Math.max(0, p[i] - dt * 8);
        place(tone, slot, i, Math.sin(p[i] * Math.PI) * capH * 0.35);
        dirty = true;
      });
      const mesh = refs[tone].current;
      if (dirty && mesh) mesh.instanceMatrix.needsUpdate = true;
    });
  });

  const cs = shadows;
  const r = Math.min(height, bodyD) * 0.12;

  return (
    <group>
      {/* Underglow spilling onto the desk */}
      <mesh position={[0, 0.0015, bodyZ]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[width * 1.3, bodyD * 1.8]} />
        <meshBasicMaterial map={glow} transparent opacity={0.45} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Space-grey aluminium case */}
      <RoundedBox args={[width, height, bodyD]} radius={r} smoothness={4} position={[0, height / 2, bodyZ]} castShadow={cs} receiveShadow={cs}>
        <meshStandardMaterial color="#2b2927" metalness={0.85} roughness={0.32} />
      </RoundedBox>
      {/* Recessed plate the caps sit in */}
      <mesh position={[0, height + 0.0006, bodyZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[COLS * pitch + pitch * 0.12, ROWS * pitch + pitch * 0.12]} />
        <meshStandardMaterial color="#0f0e0d" roughness={0.95} />
      </mesh>
      {/* Thin ember accent line along the front edge of the case */}
      <mesh position={[0, height * 0.45, bodyZ + bodyD / 2 + 0.0006]}>
        <planeGeometry args={[width - r * 2, Math.max(0.0016, height * 0.03)]} />
        <meshBasicMaterial color="#ff7a1a" toneMapped={false} />
      </mesh>

      {/* Keycaps */}
      <instancedMesh ref={alphaRef} args={[capGeo, capMats.alpha, groups.alpha.length]} castShadow={cs} />
      <instancedMesh ref={modRef} args={[capGeo, capMats.mod, groups.mod.length]} castShadow={cs} />
      <instancedMesh ref={accentRef} args={[capGeo, capMats.accent, groups.accent.length]} />

      {/* Machined volume knob, top-right corner of the case */}
      <mesh position={[width / 2 - bezel * 0.55, height + capH * 0.6, bodyZ - bodyD / 2 + bezel * 0.55]} castShadow={cs}>
        <cylinderGeometry args={[bezel * 0.32, bezel * 0.32, capH * 1.2, 32]} />
        <meshStandardMaterial color="#b9b4ae" metalness={0.95} roughness={0.22} />
      </mesh>

      {/* Walnut wrist rest */}
      <RoundedBox args={[width * 0.97, restH, restD]} radius={Math.min(restH, restD) * 0.3} smoothness={5} position={[0, restH / 2, restZ]} castShadow={cs} receiveShadow={cs}>
        <meshStandardMaterial map={walnut} roughness={0.55} />
      </RoundedBox>
    </group>
  );
}
