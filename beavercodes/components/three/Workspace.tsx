"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import {
  BackSide,
  CanvasTexture,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";
import { DESK } from "@/utils/sceneLayout";
import { BEAVER_MODEL } from "@/utils/beaverConfig";

export const LAMP = {
  base: [-0.66, DESK.top, -0.22] as const,
  head: [-0.44, 1.2, -0.06] as const,
  aim: [-0.08, DESK.top, 0.12] as const,
};

/** Desk, chair, props and the studio room around them. */
export default function Workspace({ shadows }: { shadows: boolean }) {
  const cs = shadows;
  return (
    <group>
      <Room shadows={shadows} />
      <Desk shadows={cs} />
      <Chair shadows={cs} />
      <DeskMat />
      <Mug shadows={cs} />
      <Plant shadows={cs} />
      <Notebook shadows={cs} />
      <Lamp shadows={cs} />
      <PhoneDock shadows={cs} />
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Room({ shadows }: { shadows: boolean }) {
  const slats = useRef<InstancedMesh>(null);
  const COUNT = 46;

  useEffect(() => {
    const m = slats.current;
    if (!m) return;
    const o = new Object3D();
    for (let i = 0; i < COUNT; i++) {
      o.position.set(-2.76 + i * 0.12, 1.45, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={shadows}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#110f0d" roughness={0.92} />
      </mesh>
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0.25]} receiveShadow={shadows}>
        <circleGeometry args={[1.55, 64]} />
        <meshStandardMaterial color="#1b1714" roughness={1} />
      </mesh>
      {/* Cyclorama — dark matte infinity backdrop */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[9, 9, 9, 48, 1, true]} />
        <meshStandardMaterial color="#0f0d0c" roughness={1} side={BackSide} />
      </mesh>
      {/* Acoustic walnut slat wall behind the beaver */}
      <group position={[0, 0, 2.45]}>
        <mesh position={[0, 1.45, 0.04]}>
          <boxGeometry args={[5.9, 2.9, 0.02]} />
          <meshStandardMaterial color="#0d0b0a" roughness={1} />
        </mesh>
        <instancedMesh ref={slats} args={[undefined, undefined, COUNT]} castShadow={false} receiveShadow={shadows}>
          <boxGeometry args={[0.06, 2.9, 0.045]} />
          <meshStandardMaterial color="#4b2f1e" roughness={0.6} />
        </instancedMesh>
      </group>
    </group>
  );
}

/**
 * Book-matched walnut veneer, painted procedurally: long wavy grain lines,
 * pores and a few cathedral figures. Paired with a satin clearcoat it reads
 * as an oiled hardwood top under the studio lights.
 */
function makeWalnutTexture() {
  const W = 2048;
  const H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#3d2617");
  base.addColorStop(0.5, "#4a2e1b");
  base.addColorStop(1, "#382215");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // Grain lines
  for (let i = 0; i < 260; i++) {
    const y0 = rnd() * H;
    const amp = 6 + rnd() * 26;
    const freq = 0.002 + rnd() * 0.004;
    const phase = rnd() * 10;
    ctx.strokeStyle = rnd() > 0.5 ? `rgba(20,10,5,${0.08 + rnd() * 0.18})` : `rgba(120,78,44,${0.05 + rnd() * 0.12})`;
    ctx.lineWidth = 0.6 + rnd() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) {
      const y = y0 + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 3.1 + phase) * amp * 0.25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Cathedral figures
  for (let k = 0; k < 5; k++) {
    const cx = rnd() * W;
    const cy = rnd() * H;
    for (let r = 10; r < 220; r += 9) {
      ctx.strokeStyle = `rgba(25,12,6,${0.05 + rnd() * 0.06})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 4, r * 0.7, 0, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }
  }
  // Pores
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(15,8,4,${0.15 + rnd() * 0.25})`;
    ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 3, 1);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Desk({ shadows }: { shadows: boolean }) {
  const legX = DESK.width / 2 - 0.08;
  const legZ = DESK.depth / 2 - 0.08;
  const walnut = useMemo(() => makeWalnutTexture(), []);
  useEffect(() => () => walnut.dispose(), [walnut]);
  return (
    <group>
      <mesh position={[0, DESK.top - DESK.thickness / 2, 0]} castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
        <meshPhysicalMaterial
          map={walnut}
          color="#ffffff"
          roughness={0.42}
          clearcoat={0.55}
          clearcoatRoughness={0.32}
          sheen={0.3}
          sheenColor="#c98a52"
        />
      </mesh>
      {/* Edge highlight strip */}
      <mesh position={[0, DESK.top - DESK.thickness / 2, DESK.depth / 2 + 0.001]}>
        <planeGeometry args={[DESK.width, DESK.thickness]} />
        <meshStandardMaterial color="#5a3824" roughness={0.4} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * legX, (DESK.top - DESK.thickness) / 2, sz * legZ]} castShadow={shadows}>
            <boxGeometry args={[0.04, DESK.top - DESK.thickness, 0.04]} />
            <meshStandardMaterial color="#161413" metalness={0.6} roughness={0.4} />
          </mesh>
        )),
      )}
      {/* Cable tray */}
      <mesh position={[0, DESK.top - 0.09, -0.3]}>
        <boxGeometry args={[1.2, 0.04, 0.12]} />
        <meshStandardMaterial color="#161413" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Chair({ shadows }: { shadows: boolean }) {
  const fabric = "#1d1a18";
  return (
    // Follows the beaver's placement offset so he stays seated when nudged.
    <group position={[BEAVER_MODEL.fit.offset[0], 0, 0.72 + BEAVER_MODEL.fit.offset[2]]}>
      <mesh position={[0, 0.41, 0]} castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[0.48, 0.06, 0.44]} />
        <meshStandardMaterial color={fabric} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.83, 0.26]} rotation={[-0.08, 0, 0]} castShadow={shadows}>
        <boxGeometry args={[0.46, 0.52, 0.05]} />
        <meshStandardMaterial color={fabric} roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.21, 0.6, 0.24]} castShadow={shadows}>
          <boxGeometry args={[0.025, 0.4, 0.025]} />
          <meshStandardMaterial color="#121110" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
        <meshStandardMaterial color="#121110" metalness={0.8} roughness={0.3} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.15, 0.045, 0]} castShadow={shadows}>
              <boxGeometry args={[0.3, 0.025, 0.04]} />
              <meshStandardMaterial color="#121110" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0.29, 0.022, 0]}>
              <sphereGeometry args={[0.022, 10, 8]} />
              <meshStandardMaterial color="#0a0909" roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function DeskMat() {
  return (
    <mesh position={[0, DESK.top + 0.002, 0.13]} receiveShadow>
      <boxGeometry args={[0.92, 0.004, 0.42]} />
      <meshStandardMaterial color="#201c19" roughness={1} />
    </mesh>
  );
}

/* ---------------------------- Props ---------------------------- */

function makeSteamTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,240,225,0.55)");
  g.addColorStop(1, "rgba(255,240,225,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Mug({ shadows }: { shadows: boolean }) {
  const steam = useRef<Group>(null);
  const tex = useMemo(() => makeSteamTexture(), []);
  const puffs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ offset: i / 7, sway: Math.random() * 6 })), []);
  const mats = useMemo(
    () => puffs.map(() => new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 })),
    [puffs, tex],
  );
  useEffect(
    () => () => {
      tex.dispose();
      mats.forEach((m) => m.dispose());
    },
    [tex, mats],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    steam.current?.children.forEach((child, i) => {
      const k = (t * 0.22 + puffs[i].offset) % 1;
      child.position.set(Math.sin(t * 0.8 + puffs[i].sway) * 0.012 * k, k * 0.2, Math.cos(t * 0.6 + i) * 0.006);
      child.scale.setScalar(0.03 + k * 0.06);
      mats[i].opacity = Math.sin(k * Math.PI) * 0.22;
    });
  });

  return (
    <group position={[0.43, DESK.top, 0.24]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.048, 0]} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.038, 0.034, 0.096, 32]} />
        <meshStandardMaterial color="#ff7a1a" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.033, 32]} />
        <meshStandardMaterial color="#2a160c" roughness={0.15} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]} castShadow={shadows}>
        <torusGeometry args={[0.022, 0.0065, 10, 24]} />
        <meshStandardMaterial color="#ff7a1a" roughness={0.38} />
      </mesh>
      <group ref={steam} position={[0, 0.1, 0]}>
        {puffs.map((_, i) => (
          <Billboard key={i}>
            <mesh material={mats[i]}>
              <planeGeometry args={[1, 1]} />
            </mesh>
          </Billboard>
        ))}
      </group>
    </group>
  );
}

function Plant({ shadows }: { shadows: boolean }) {
  const blades = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + (i % 2) * 0.3;
        return {
          a,
          h: 0.2 + ((i * 37) % 10) / 70,
          tilt: 0.08 + ((i * 13) % 5) / 40,
          r: 0.018 + (i % 3) * 0.006,
        };
      }),
    [],
  );
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
  });
  return (
    <group position={[0.7, DESK.top, -0.2]}>
      <mesh position={[0, 0.065, 0]} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.065, 0.05, 0.13, 32]} />
        <meshStandardMaterial color="#d9cfc2" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.058, 24]} />
        <meshStandardMaterial color="#20160f" roughness={1} />
      </mesh>
      <group ref={group} position={[0, 0.125, 0]}>
        {blades.map((b, i) => (
          <mesh
            key={i}
            position={[Math.cos(b.a) * 0.02, b.h / 2, Math.sin(b.a) * 0.02]}
            rotation={[Math.sin(b.a) * b.tilt, b.a, -Math.cos(b.a) * b.tilt]}
            scale={[1, 1, 0.28]}
            castShadow={shadows}
          >
            <coneGeometry args={[b.r, b.h, 8]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#6b7f45" : "#4d6334"} roughness={0.55} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Notebook({ shadows }: { shadows: boolean }) {
  return (
    <group position={[-0.42, DESK.top, 0.2]} rotation={[0, 0.28, 0]}>
      <mesh position={[0, 0.008, 0]} castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[0.15, 0.016, 0.21]} />
        <meshStandardMaterial color="#1e1b19" roughness={0.7} />
      </mesh>
      <mesh position={[0.0, 0.006, 0]}>
        <boxGeometry args={[0.146, 0.01, 0.206]} />
        <meshStandardMaterial color="#efe6d8" roughness={0.9} />
      </mesh>
      <mesh position={[0.058, 0.0165, 0]}>
        <boxGeometry args={[0.008, 0.002, 0.212]} />
        <meshStandardMaterial color="#ff7a1a" roughness={0.6} />
      </mesh>
      {/* Pencil */}
      <group position={[-0.01, 0.021, 0.01]} rotation={[0, 0.5, Math.PI / 2]}>
        <mesh castShadow={shadows}>
          <cylinderGeometry args={[0.0045, 0.0045, 0.15, 6]} />
          <meshStandardMaterial color="#e8b04a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.083, 0]}>
          <coneGeometry args={[0.0045, 0.016, 6]} />
          <meshStandardMaterial color="#d8c3a1" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Lamp({ shadows }: { shadows: boolean }) {
  const metal = { color: "#191716", metalness: 0.7, roughness: 0.35 } as const;
  const [bx, by, bz] = LAMP.base;
  const [hx, hy, hz] = LAMP.head;
  const elbow: [number, number, number] = [bx + 0.04, by + 0.3, bz + 0.02];
  const seg = (a: readonly number[], b: readonly number[]) => {
    const from = new Vector3(a[0], a[1], a[2]);
    const dir = new Vector3(b[0], b[1], b[2]).sub(from);
    const len = dir.length();
    const mid = from.clone().addScaledVector(dir, 0.5);
    const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize());
    return { len, mid, quat };
  };
  const s1 = seg(LAMP.base, elbow);
  const s2 = seg(elbow, LAMP.head);
  return (
    <group>
      <mesh position={[bx, by + 0.008, bz]} castShadow={shadows}>
        <cylinderGeometry args={[0.07, 0.075, 0.016, 32]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={s1.mid} quaternion={s1.quat} castShadow={shadows}>
        <cylinderGeometry args={[0.007, 0.007, s1.len, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={elbow}>
        <sphereGeometry args={[0.013, 12, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={s2.mid} quaternion={s2.quat} castShadow={shadows}>
        <cylinderGeometry args={[0.007, 0.007, s2.len, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* Shade, tipped toward the desk */}
      <group position={[hx, hy, hz]} rotation={[0.35, 0, -0.65]}>
        <mesh castShadow={shadows}>
          <coneGeometry args={[0.06, 0.09, 32, 1, true]} />
          <meshStandardMaterial {...metal} side={2} />
        </mesh>
        <mesh position={[0, -0.025, 0]}>
          <sphereGeometry args={[0.022, 16, 12]} />
          <meshBasicMaterial color="#ffd3a1" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function PhoneDock({ shadows }: { shadows: boolean }) {
  const ring = useRef<Mesh>(null);
  useFrame((state) => {
    const m = ring.current?.material as MeshBasicMaterial | undefined;
    if (m) m.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 1.4) * 0.25;
  });
  return (
    <group position={[0.36, DESK.top, -0.14]} rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.005, 0]} receiveShadow={shadows}>
        <cylinderGeometry args={[0.055, 0.058, 0.01, 40]} />
        <meshStandardMaterial color="#1b1918" roughness={0.6} />
      </mesh>
      <mesh ref={ring} position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.046, 0.05, 48]} />
        <meshBasicMaterial color="#ff7a1a" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.015, 0]} castShadow={shadows}>
        <boxGeometry args={[0.072, 0.008, 0.148]} />
        <meshStandardMaterial color="#0c0c0d" roughness={0.12} metalness={0.4} />
      </mesh>
    </group>
  );
}
