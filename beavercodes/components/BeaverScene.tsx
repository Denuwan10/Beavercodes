"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, PerformanceMonitor, Preload } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import BeaverModel from "./three/BeaverModel";
import Workspace from "./three/Workspace";
import Laptop from "./three/Laptop";
import SceneLighting from "./three/SceneLighting";
import Particles from "./three/Particles";
import CodeSymbols from "./three/CodeSymbols";
import CameraAnimation from "./three/CameraAnimation";
import ScreenPortalSync from "./three/ScreenPortalSync";
import Effects from "./three/Effects";
import FloatingUI from "./three/FloatingUI";
import { QUALITY, type Tier } from "@/hooks/useDeviceTier";
import { experience, useExperience } from "@/utils/store";
import { DESK } from "@/utils/sceneLayout";

type Props = {
  tier: Tier;
  /** Integrated / software GPU: cap the canvas at 1× (≈35% fewer pixels at 125% scaling). */
  weakGpu?: boolean;
  active: boolean;
  isTouch: boolean;
  portal: React.RefObject<HTMLDivElement | null>;
  canvasWrap: React.RefObject<HTMLDivElement | null>;
  flash: React.RefObject<HTMLDivElement | null>;
};

/** Marks the scene ready after the first rendered frame (`sceneReady` in the store). */
function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => experience.set({ sceneReady: true }));
  });
  return null;
}

/**
 * Shadows are baked once instead of re-rendered every frame (the only thing
 * that moves is the beaver's gentle breathing). They are re-baked when the
 * beaver model arrives, so it still casts its shadow.
 */
function ShadowBudget() {
  const gl = useThree((s) => s.gl);
  const modelReady = useExperience((s) => s.modelReady);
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
  }, [gl, modelReady]);
  return null;
}

export default function BeaverScene({ tier, weakGpu, active, isTouch, portal, canvasWrap, flash }: Props) {
  const base = QUALITY[tier];
  const q = weakGpu ? { ...base, dpr: [1, 1] as [number, number] } : base;
  const [dpr, setDpr] = useState(q.dpr[1]);
  // Integrated GPUs skip the full post stack but keep a light one (vignette,
  // tone mapping, dive warp) so the drag-through-the-screen transition stays.
  const [post, setPost] = useState(q.post || !!weakGpu);
  const litePost = !q.post;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[q.dpr[0], dpr]}
      shadows={q.shadows ? { type: PCFSoftShadowMap } : false}
      camera={{ fov: 34, near: 0.01, far: 40, position: [-2.15, 1.62, -3.05] }}
      gl={{
        antialias: !post,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl }) => gl.setClearColor("#0c0a09")}
      aria-label="A beaver developer coding at a desk in a warm, dark studio"
    >
      <color attach="background" args={["#0c0a09"]} />
      <fog attach="fog" args={["#0c0a09", 4.2, 11]} />

      <PerformanceMonitor
        onDecline={() => {
          setDpr((d) => Math.max(q.dpr[0], d - 0.25));
          // Dropping the post stack makes the GPU recompile every material —
          // a visible freeze. Only do it while the preloader still covers the
          // scene; once the intro is playing, lower the resolution instead.
          if (!experience.get().loaded) setPost(false);
        }}
        onIncline={() => setDpr((d) => Math.min(q.dpr[1], d + 0.25))}
        flipflops={3}
      />
      <AdaptiveDpr pixelated={false} />

      <CameraAnimation parallax={!isTouch} />
      <SceneLighting shadows={q.shadows} quality={tier} />
      <ShadowBudget />

      <Workspace shadows={q.shadows} />
      <Laptop shadows={q.shadows} />
      <BeaverModel shadows={q.shadows} />

      <ContactShadows
        position={[0, 0.004, 0.25]}
        scale={3.4}
        far={DESK.top + 0.6}
        blur={2.6}
        opacity={0.75}
        resolution={tier === "low" ? 256 : 512}
        frames={1}
        color="#000000"
      />

      <Particles count={q.particles} />
      <CodeSymbols count={q.symbols} />
      <FloatingUI count={tier === "low" ? 3 : 6} />

      {/* No CSS blur on the portal: filtering a full-page layer every frame
          stutters the dive; the flash overlay carries the light transition. */}
      <ScreenPortalSync portal={portal} canvasWrap={canvasWrap} flash={flash} cssFilters={false} />
      {post && <Effects lite={litePost} />}
      <FirstFrame />
      <Preload all />
    </Canvas>
  );
}
