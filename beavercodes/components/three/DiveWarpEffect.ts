import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform } from "three";

/**
 * Lens effect for the dive into the laptop display. At strength 0 it is a
 * pass-through; as strength rises it adds:
 *   - barrel warp that pulls the frame toward the centre (tunnel feel)
 *   - radial chromatic split, stronger toward the edges
 *   - short radial streaks (zoom blur) for motion
 *   - a warm light bleed at the edges, matching the DOM light transition
 * Samples the input buffer, so it is declared as a convolution effect.
 */
const fragment = /* glsl */ `
uniform float strength;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (strength <= 0.0005) { outputColor = inputColor; return; }

  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  // Barrel: pull samples outward so the image bulges toward the viewer.
  vec2 wuv = 0.5 + c * (1.0 - strength * 0.28 * r2 * 4.0);
  vec2 dir = (wuv - 0.5) * strength * 0.018;

  vec3 col;
  col.r = texture2D(inputBuffer, wuv + dir).r;
  col.g = texture2D(inputBuffer, wuv).g;
  col.b = texture2D(inputBuffer, wuv - dir).b;

  vec3 streak = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float k = float(i) / 6.0;
    streak += texture2D(inputBuffer, wuv - (wuv - 0.5) * k * 0.07 * strength).rgb;
  }
  streak /= 6.0;

  vec3 res = mix(col, streak, strength * 0.55);
  float edge = smoothstep(0.15, 0.75, sqrt(r2) * 1.4);
  res += vec3(1.0, 0.56, 0.22) * strength * 0.12 * edge;
  outputColor = vec4(res, inputColor.a);
}
`;

export class DiveWarpEffect extends Effect {
  constructor() {
    super("DiveWarpEffect", fragment, {
      blendFunction: BlendFunction.NORMAL,
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map([["strength", new Uniform(0)]]),
    });
  }

  set strength(v: number) {
    (this.uniforms.get("strength") as Uniform<number>).value = v;
  }

  get strength() {
    return (this.uniforms.get("strength") as Uniform<number>).value;
  }
}
