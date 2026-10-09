"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Color, DirectionalLight, Object3D, SpotLight } from "three";
import { sceneState } from "@/utils/sceneState";
import { lerp, range, smoothstep } from "@/utils/math";
import { LAMP } from "./Workspace";

/**
 * Cinematic three-point setup:
 *   key   – warm, from camera-left, casts the main soft shadows
 *   lamp  – practical desk lamp pool of light
 *   rim   – desaturated back light separating the beaver from the dark
 *   wall  – grazing wash on the slat wall that warms up as you scroll in
 * plus an image-based environment for believable reflections.
 */
export default function SceneLighting({ shadows, quality }: { shadows: boolean; quality: "low" | "mid" | "high" }) {
  const key = useRef<DirectionalLight>(null);
  const lamp = useRef<SpotLight>(null);
  const wall = useRef<SpotLight>(null);
  const hdr = process.env.NEXT_PUBLIC_HDR_URL;

  const colors = useMemo(
    () => ({
      keyCool: new Color("#ffd9b5"),
      keyWarm: new Color("#ff9d58"),
      wallCool: new Color("#b8743f"),
      wallWarm: new Color("#ff7a1a"),
    }),
    [],
  );

  // Aim targets need to live in the scene graph.
  const keyTarget = useMemo(() => {
    const o = new Object3D();
    o.position.set(0, 0.9, 0.35);
    return o;
  }, []);
  const lampTarget = useMemo(() => {
    const o = new Object3D();
    o.position.set(...LAMP.aim);
    return o;
  }, []);
  const wallTarget = useMemo(() => {
    const o = new Object3D();
    o.position.set(0, 2.4, 2.45);
    return o;
  }, []);

  useEffect(() => {
    if (key.current) key.current.target = keyTarget;
    if (lamp.current) lamp.current.target = lampTarget;
    if (wall.current) wall.current.target = wallTarget;
  }, [keyTarget, lampTarget, wallTarget]);

  useFrame(() => {
    const warm = smoothstep(range(sceneState.p, 0, 0.32));
    if (key.current) {
      key.current.color.lerpColors(colors.keyCool, colors.keyWarm, warm);
      key.current.intensity = lerp(1.35, 1.75, warm);
    }
    if (wall.current) {
      wall.current.color.lerpColors(colors.wallCool, colors.wallWarm, warm);
      wall.current.intensity = lerp(6, 14, warm);
    }
    if (lamp.current) lamp.current.intensity = lerp(2.2, 3.2, warm);
  });

  const mapSize = quality === "high" ? 2048 : 1024;

  return (
    <>
      <primitive object={keyTarget} />
      <primitive object={lampTarget} />
      <primitive object={wallTarget} />

      <ambientLight intensity={0.08} color="#ffe4cc" />

      <directionalLight
        ref={key}
        position={[-2.4, 3.3, -2.1]}
        intensity={1.35}
        castShadow={shadows}
        shadow-mapSize={[mapSize, mapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={1.8}
        shadow-camera-bottom={-1.2}
        shadow-camera-near={0.5}
        shadow-camera-far={9}
      />

      <spotLight
        ref={lamp}
        position={[...LAMP.head]}
        angle={0.75}
        penumbra={0.85}
        distance={3}
        decay={2}
        intensity={2.2}
        color="#ffc590"
        castShadow={shadows && quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />

      {/* Cool-neutral rim from behind the beaver */}
      <directionalLight position={[1.8, 2.6, 3.2]} intensity={0.9} color="#c4cbd6" />

      {/* Grazing wash on the slat wall */}
      <spotLight
        ref={wall}
        position={[0, 0.15, 1.75]}
        angle={0.9}
        penumbra={1}
        distance={5}
        decay={2}
        intensity={6}
        color="#b8743f"
      />

      {hdr ? (
        <Environment files={hdr} environmentIntensity={0.35} />
      ) : (
        <Environment resolution={quality === "low" ? 64 : 256} frames={1} environmentIntensity={0.45}>
          <Lightformer form="rect" intensity={2.2} color="#ffd2a6" position={[-3, 3, -2]} scale={[4, 2, 1]} target={[0, 1, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#ff8a3d" position={[3, 1.5, 1]} scale={[3, 2, 1]} target={[0, 1, 0]} />
          <Lightformer form="ring" intensity={0.8} color="#fff1e4" position={[0, 4, 0]} scale={2} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.5} color="#9fb0c8" position={[0, 2, 4]} scale={[5, 2, 1]} target={[0, 1, 0]} />
        </Environment>
      )}
    </>
  );
}
