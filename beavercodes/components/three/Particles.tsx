"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from "three";
import { sceneState } from "@/utils/sceneState";
import { range } from "@/utils/math";

const vertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float speed = 0.015 + aSeed * 0.035;
    p.y = 0.15 + mod(p.y - 0.15 + uTime * speed, 2.2);
    p.x += sin(uTime * 0.35 + aSeed * 40.0) * 0.06;
    p.z += cos(uTime * 0.28 + aSeed * 23.0) * 0.05;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aSeed) / max(0.05, -mv.z);
    float h = (p.y - 0.15) / 2.2;
    vAlpha = smoothstep(0.0, 0.12, h) * smoothstep(1.0, 0.75, h) * (0.35 + 0.65 * fract(aSeed * 7.13));
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * uOpacity * vAlpha);
  }
`;

/** Warm dust motes drifting through the workshop — appear as you scroll in. */
export default function Particles({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 60% around the desk, 40% in the wider room
      const near = i < count * 0.6;
      pos[i * 3] = (Math.random() - 0.5) * (near ? 1.8 : 4.2);
      pos[i * 3 + 1] = 0.15 + Math.random() * 2.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * (near ? 1.6 : 4) + 0.2;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 26 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 0 },
          uColor: { value: new Color("#ffb35c") },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const p = sceneState.p;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = dpr;
    material.uniforms.uOpacity.value = 0.12 + range(p, 0.02, 0.2) * 0.75 * (1 - range(p, 0.6, 0.74));
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
