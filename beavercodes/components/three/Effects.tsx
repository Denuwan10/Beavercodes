"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import { sceneState } from "@/utils/sceneState";
import { lerp, range } from "@/utils/math";
import { cameraTarget } from "./CameraAnimation";
import { DiveWarpEffect } from "./DiveWarpEffect";

/**
 * Cinematic post stack (desktop / high tier):
 *   N8AO          screen-space ambient occlusion — off by default (the most
 *                 expensive pass; ContactShadows already ground the props)
 *   DepthOfField  locked to the camera's look-at point; melts away on the dive
 *                 (rendered at half resolution — bokeh is soft anyway)
 *   Bloom         restrained, for the display, lamp and glow halo
 *   Vignette      frames the shot
 *   ToneMapping   ACES filmic
 *   DiveWarp      lens warp + chroma + streaks while passing through the glass
 */
export default function Effects({ ao = false }: { ao?: boolean }) {
  const dof = useRef<DepthOfFieldEffect>(null);
  const warp = useMemo(() => new DiveWarpEffect(), []);

  useFrame(() => {
    const p = sceneState.p;
    const effect = dof.current;
    if (effect) {
      effect.target = cameraTarget;
      effect.bokehScale = lerp(2.8, 0, range(p, 0.46, 0.62));
    }
    warp.strength = sceneState.warp;
  });

  return (
    <EffectComposer multisampling={0}>
      <>{ao && <N8AO aoRadius={0.35} intensity={2.2} distanceFalloff={0.6} quality="medium" halfRes />}</>
      <DepthOfField ref={dof} target={[0, 1, 0.3]} worldFocusRange={0.9} bokehScale={2.8} resolutionScale={0.5} />
      <Bloom mipmapBlur intensity={0.42} luminanceThreshold={0.8} luminanceSmoothing={0.22} />
      <Vignette offset={0.28} darkness={0.6} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <primitive object={warp} />
    </EffectComposer>
  );
}
