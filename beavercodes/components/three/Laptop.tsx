"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Color, MeshBasicMaterial, PointLight, SRGBColorSpace } from "three";
import { DESK, MONITOR, SCREEN, SCREEN_LOCAL_CENTER } from "@/utils/sceneLayout";
import { sceneState } from "@/utils/sceneState";
import { lerp, range, smoothstep } from "@/utils/math";
import { LID_LOGO_ASPECT, ScreenCanvas, makeLidLogoTexture } from "./ScreenTexture";

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
  g.addColorStop(0, "rgba(255,226,196,0.55)");
  g.addColorStop(0.45, "rgba(255,160,90,0.18)");
  g.addColorStop(1, "rgba(255,122,26,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * Aluminium desktop monitor on a stand. The display is a live canvas texture
 * (see ScreenTexture), repainted at ~12 fps and frozen once the DOM website
 * has taken over.
 */
export default function Laptop({ shadows }: { shadows: boolean }) {
  const screenLight = useRef<PointLight>(null);
  const acc = useRef(0);

  const screen = useMemo(() => {
    const s = new ScreenCanvas(1280, 800);
    s.draw(0, 0);
    return s;
  }, []);
  const screenMat = useMemo(
    () => new MeshBasicMaterial({ map: screen.texture, toneMapped: false, color: new Color(0.6, 0.6, 0.6) }),
    [screen],
  );
  const logo = useMemo(() => makeLidLogoTexture(), []);
  const glowMat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: makeGlowTexture(),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      screen.dispose();
      screenMat.dispose();
      logo.dispose();
      glowMat.map?.dispose();
      glowMat.dispose();
    },
    [screen, screenMat, logo, glowMat],
  );

  useFrame((state, dt) => {
    const p = sceneState.p;
    // Brightness ramps up as the camera focuses (20% → 50%).
    const bright = lerp(0.62, 1.08, smoothstep(range(p, 0.18, 0.48)));
    screenMat.color.setScalar(bright);
    const focus = smoothstep(range(p, 0.2, 0.5));
    if (screenLight.current) screenLight.current.intensity = lerp(0.035, 0.2, focus);
    // Halo swells through the focus beat and burns out as we pass the glass.
    glowMat.opacity = lerp(0.12, 0.55, focus) * (1 - smoothstep(range(p, 0.62, 0.74)));

    // Repaint at ~12fps; stop once the DOM portal fully covers the screen.
    if (p > 0.66) return;
    acc.current += dt;
    if (acc.current < 1 / 12) return;
    acc.current = 0;
    screen.draw(state.clock.elapsedTime, smoothstep(range(p, 0.2, 0.47)));
  });

  const cs = shadows;
  const alu = "#9a9692";
  const M = MONITOR;
  const neckTop = M.center.y - 0.02;

  return (
    <group>
      {/* Stand: weighted foot + upright neck behind the panel */}
      <mesh position={[0, DESK.top + 0.004, M.footZ]} castShadow={cs} receiveShadow={cs}>
        <boxGeometry args={[0.24, 0.008, 0.17]} />
        <meshStandardMaterial color={alu} metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, (DESK.top + neckTop) / 2, M.footZ - 0.02]} castShadow={cs}>
        <boxGeometry args={[0.06, neckTop - DESK.top, 0.016]} />
        <meshStandardMaterial color={alu} metalness={0.75} roughness={0.32} />
      </mesh>

      {/* Panel, leaning back slightly around its centre */}
      <group position={M.center} rotation={[M.tilt, 0, 0]}>
        <mesh castShadow={cs}>
          <boxGeometry args={[M.panelW, M.panelH, M.panelT]} />
          <meshStandardMaterial color={alu} metalness={0.75} roughness={0.32} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0, M.panelT / 2 + 0.0004]}>
          <planeGeometry args={[M.panelW - 0.008, M.panelH - 0.008]} />
          <meshStandardMaterial color="#0b0a0a" roughness={0.15} metalness={0.2} />
        </mesh>
        {/* Display */}
        <mesh position={SCREEN_LOCAL_CENTER} material={screenMat}>
          <planeGeometry args={[M.screenW, M.screenH]} />
        </mesh>
        {/* Cover glass: picks up studio reflections over the live display */}
        <mesh position={[0, SCREEN_LOCAL_CENTER.y, SCREEN_LOCAL_CENTER.z + 0.0008]} renderOrder={2}>
          <planeGeometry args={[M.screenW, M.screenH]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.07}
            roughness={0.04}
            metalness={0.6}
            envMapIntensity={2.2}
            depthWrite={false}
          />
        </mesh>
        {/* Glow: a halo spilling round the panel edges (the panel itself
            occludes the centre, so the display stays crisp) that blooms as we focus */}
        <mesh position={[0, SCREEN_LOCAL_CENTER.y, 0]} material={glowMat} renderOrder={3}>
          <planeGeometry args={[M.screenW * 1.9, M.screenH * 2.2]} />
        </mesh>
        {/* Glowing logo on the back of the panel */}
        <mesh position={[0, 0.02, -M.panelT / 2 - 0.0005]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.15, 0.15 / LID_LOGO_ASPECT]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* Screen spill onto the beaver's face */}
      <pointLight
        ref={screenLight}
        position={SCREEN.center.clone().addScaledVector(SCREEN.normal, 0.18)}
        color="#ffe2c4"
        intensity={0.035}
        distance={1.1}
        decay={2}
      />
    </group>
  );
}
