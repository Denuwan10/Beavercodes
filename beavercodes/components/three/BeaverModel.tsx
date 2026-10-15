"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import {
  AnimationAction,
  Bone,
  Box3,
  Euler,
  Group,
  LoopOnce,
  LoopRepeat,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  SkinnedMesh,
  SRGBColorSpace,
  Vector3,
} from "three";
import { BEAVER, DESK } from "@/utils/sceneLayout";
import PremiumKeyboard from "./PremiumKeyboard";
import { BEAVER_MODEL } from "@/utils/beaverConfig";
import { experience } from "@/utils/store";
import { sceneState } from "@/utils/sceneState";
import { range, smoothstep } from "@/utils/math";

/**
 * <BeaverModel />
 *
 * Loads the production character from /public/models/beaver.glb (configurable
 * in utils/beaverConfig.ts) and brings it to life with two stacked layers:
 *
 *  1. Authored animation — clips in the file matching Idle / Typing / Blink
 *     are played through an AnimationMixer and layered.
 *  2. Procedural performance — computed every frame on top of the mixer:
 *       breathing (chest bone, or whole body for static meshes)
 *       blinking  (blink clip or blink shape key when present)
 *       typing    (forearm/hand bones when no Typing clip exists)
 *       head movement + eye tracking toward the cursor
 *       leaning in as the camera focuses on the laptop
 *
 * Works with fully rigged characters, rigged-but-unanimated exports, and
 * static meshes (e.g. image-to-3D output) — each gets as much life as its
 * data allows. Nothing is drawn while the file streams, or if it is missing
 * or fails to parse.
 */
export default function BeaverModel({ shadows }: { shadows: boolean }) {
  const available = useAssetAvailable(BEAVER_MODEL.url);
  // No model to wait for: let the preloader finish.
  useEffect(() => {
    if (available === false) experience.set({ modelReady: true });
  }, [available]);
  if (available !== true) return null;
  return (
    <ModelErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <GLTFBeaver shadows={shadows} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

/** HEAD-check an asset so a missing GLB never throws inside Suspense. */
function useAssetAvailable(url: string) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(url, { method: "HEAD" })
      .then((r) => {
        if (alive) setOk(r.ok);
      })
      .catch(() => {
        if (alive) setOk(false);
      });
    return () => {
      alive = false;
    };
  }, [url]);
  return ok;
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[BeaverModel] Could not load the GLB; no beaver is shown.", error);
    experience.set({ modelReady: true });
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  GLB character                                                      */
/* ------------------------------------------------------------------ */

type Rig = Partial<Record<keyof typeof BEAVER_MODEL.bones, Bone>>;

function findRig(root: Object3D): Rig {
  const bones: Bone[] = [];
  root.traverse((o) => {
    if ((o as Bone).isBone) bones.push(o as Bone);
  });
  const rig: Rig = {};
  (Object.keys(BEAVER_MODEL.bones) as Array<keyof typeof BEAVER_MODEL.bones>).forEach((key) => {
    rig[key] = bones.find((b) => BEAVER_MODEL.bones[key].test(b.name));
  });
  return rig;
}

function findBlinkMorphs(root: Object3D) {
  const out: Array<{ mesh: Mesh; index: number }> = [];
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh || !m.morphTargetDictionary || !m.morphTargetInfluences) return;
    for (const [name, index] of Object.entries(m.morphTargetDictionary)) {
      if (BEAVER_MODEL.morphs.blink.test(name)) out.push({ mesh: m, index });
    }
  });
  return out;
}

/**
 * Rotate a bone by a delta expressed in character space (x = pitch,
 * y = yaw, z = roll), pivoting on the bone. Rig-agnostic: works whatever
 * local axes the exporter gave each bone.
 */
const _pq = new Quaternion();
const _pqi = new Quaternion();
const _d = new Quaternion();
const _e = new Euler();
function rotateBone(bone: Bone, charQ: Quaternion, charQi: Quaternion, x: number, y: number, z = 0) {
  if (!bone.parent) return;
  _d.setFromEuler(_e.set(x, y, z, "YXZ"));
  _d.premultiply(charQ).multiply(charQi); // character space → world
  bone.parent.getWorldQuaternion(_pq);
  _pqi.copy(_pq).invert();
  _d.premultiply(_pqi).multiply(_pq); // world → parent space
  bone.quaternion.premultiply(_d);
}

function GLTFBeaver({ shadows }: { shadows: boolean }) {
  const character = useRef<Group>(null);
  const { scene, animations } = useGLTF(BEAVER_MODEL.url, BEAVER_MODEL.draco, BEAVER_MODEL.meshopt);
  const { actions, names } = useAnimations(animations, character);

  // Tell the preloader once the model has actually been drawn (its shaders are
  // compiled in that first frame) so it never pops in after the curtain lifts.
  const reported = useRef(false);
  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    requestAnimationFrame(() => experience.set({ modelReady: true }));
  });

  // Prepare once: materials, shadows, auto-fit, rig discovery.
  const prepared = useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = shadows;
      mesh.receiveShadow = shadows;
      if ((mesh as SkinnedMesh).isSkinnedMesh) mesh.frustumCulled = false;
      const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Material[];
      mats.forEach((mat) => {
        const std = mat as MeshStandardMaterial;
        if (std.map) std.map.colorSpace = SRGBColorSpace;
        if (typeof std.envMapIntensity === "number") std.envMapIntensity = 0.9;
      });
    });

    // Auto-fit: scale to seated height, feet on the floor, centred on the chair.
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const scale = BEAVER_MODEL.fit.height / Math.max(1e-4, size.y);
    const pivot = new Vector3(
      (box.min.x + box.max.x) / 2,
      box.min.y,
      box.min.z + size.z * BEAVER_MODEL.fit.pivotDepth,
    );

    // Bind-pose rotations for bones we drive procedurally.
    const rig = findRig(scene);
    const rest = new Map<Bone, Quaternion>();
    Object.values(rig).forEach((b) => {
      if (b) rest.set(b, b.quaternion.clone());
    });

    // Bones already driven by authored animation keep their clip pose as base.
    const animated = new Set<string>();
    animations.forEach((clip) => clip.tracks.forEach((tr) => animated.add(tr.name.split(".")[0])));

    return { scale, pivot, rig, rest, animated, blinkMorphs: findBlinkMorphs(scene), rigged: rest.size > 0 };
  }, [scene, animations, shadows]);

  // Authored clips: idle + typing layered, blink fired on demand.
  const blinkAction = useRef<AnimationAction | null>(null);
  useEffect(() => {
    const find = (re: RegExp) => names.find((n) => re.test(n));
    const idle = find(BEAVER_MODEL.clips.idle);
    const typing = find(BEAVER_MODEL.clips.typing);
    const blinkClip = find(BEAVER_MODEL.clips.blink);
    const looping = [idle, typing].filter((n): n is string => !!n);
    if (!looping.length && names.length && names[0] !== blinkClip) looping.push(names[0]);
    looping.forEach((n, i) => {
      const a = actions[n];
      if (!a) return;
      a.setLoop(LoopRepeat, Infinity);
      a.setEffectiveWeight(i === 0 ? 1 : 0.85);
      a.reset().fadeIn(0.6).play();
    });
    const b = blinkClip ? actions[blinkClip] : null;
    if (b) {
      b.setLoop(LoopOnce, 1);
      b.clampWhenFinished = false;
      blinkAction.current = b;
    }
    return () => {
      looping.forEach((n) => actions[n]?.fadeOut(0.3));
    };
  }, [actions, names]);

  const blink = useRef({ next: 2.4, t: -1 });
  const gaze = useRef({ x: 0, y: 0 });
  const charQ = useMemo(() => new Quaternion(), []);
  const charQi = useMemo(() => new Quaternion(), []);
  const hasTypingClip = useMemo(() => names.some((n) => BEAVER_MODEL.clips.typing.test(n)), [names]);

  // Runs after useAnimations' own frame callback (registered first), so
  // procedural offsets sit on top of the mixer's pose.
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const focus = smoothstep(range(sceneState.p, 0.2, 0.5));
    const { rig, rest, animated, blinkMorphs, rigged, scale } = prepared;
    const G = BEAVER_MODEL.gaze;

    // Gaze follows quick cursor moves, then settles back on the laptop.
    const curious = (0.22 + sceneState.pointerEnergy * 0.6) * (1 - focus);
    const k = Math.min(1, dt * 5);
    gaze.current.x += (sceneState.px * curious - gaze.current.x) * k;
    gaze.current.y += (sceneState.py * curious - gaze.current.y) * k;

    // Reset procedurally-driven bones that no clip touches (prevents drift).
    rest.forEach((q, bone) => {
      if (!animated.has(bone.name)) bone.quaternion.copy(q);
    });

    const breath = Math.sin(t * 1.6);

    if (rigged && character.current) {
      character.current.getWorldQuaternion(charQ);
      charQi.copy(charQ).invert();

      if (rig.chest) rotateBone(rig.chest, charQ, charQi, 0.012 * breath + focus * 0.05, 0);

      const headBone = rig.head ?? rig.neck;
      if (headBone) {
        rotateBone(
          headBone,
          charQ,
          charQi,
          Math.sin(t * 0.7) * 0.025 + focus * 0.06 - gaze.current.y * G.pitch,
          Math.sin(t * 0.45) * 0.07 * (1 - curious) + gaze.current.x * G.head,
          Math.sin(t * 0.33) * 0.025,
        );
      }
      for (const eye of [rig.eyeL, rig.eyeR]) {
        if (eye) rotateBone(eye, charQ, charQi, -gaze.current.y * G.eyes * 0.5, gaze.current.x * G.eyes);
      }

      // Procedural typing when the file carries no typing clip.
      if (!hasTypingClip) {
        const burst = smoothstep(Math.min(1, Math.max(0, Math.sin(t * 0.55) * 1.6 + 0.6)));
        const l = Math.max(0, Math.sin(t * 15)) * 0.09 * burst;
        const r = Math.max(0, Math.sin(t * 15 + 2.1)) * 0.09 * burst;
        if (rig.handL) rotateBone(rig.handL, charQ, charQi, l, 0);
        if (rig.handR) rotateBone(rig.handR, charQ, charQi, r, 0);
        if (rig.forearmL) rotateBone(rig.forearmL, charQ, charQi, l * 0.3, Math.sin(t * 2.3) * 0.02 * burst);
        if (rig.forearmR) rotateBone(rig.forearmR, charQ, charQi, r * 0.3, Math.sin(t * 1.9) * 0.02 * burst);
      }
    }

    // Whole-body layer: breathing, lean-in, cursor sway. For static meshes
    // (no skeleton) this carries the whole performance.
    if (character.current) {
      const amount = rigged ? 0.004 : 0.012;
      const b = (breath * 0.5 + 0.5) * amount;
      character.current.scale.set(scale * (1 + b * 0.5), scale * (1 + b), scale * (1 + b * 0.6));
      const sway = rigged ? 0.15 : 1;
      character.current.rotation.x = -focus * 0.04 + Math.sin(t * 0.7) * 0.006 * sway;
      character.current.rotation.y = BEAVER_MODEL.fit.yaw + gaze.current.x * 0.06 * sway;
      character.current.rotation.z = Math.sin(t * 0.33) * 0.004 * sway;
    }

    // Blinking: authored clip and/or shape keys.
    const bl = blink.current;
    if (bl.t < 0 && t > bl.next) {
      bl.t = 0;
      blinkAction.current?.reset().play();
    }
    if (bl.t >= 0) {
      bl.t += dt;
      const kk = bl.t / 0.16;
      const closed = kk < 0.5 ? kk * 2 : Math.max(0, 2 - kk * 2);
      blinkMorphs.forEach(({ mesh, index }) => {
        if (mesh.morphTargetInfluences) mesh.morphTargetInfluences[index] = closed;
      });
      if (kk >= 1) {
        bl.t = -1;
        bl.next = t + (Math.random() < 0.2 ? 0.25 : 2.2 + Math.random() * 3.2);
      }
    }
  });

  const [ox, oy, oz] = BEAVER_MODEL.fit.offset;
  const { pivot, scale } = prepared;
  const rootY = BEAVER.position.y + oy;

  // Keyboard: built around the keyboard baked into the mesh (see beaverConfig).
  // Model-space measurements → this group's space using the static fit (not the
  // breathing/sway on `character`). It stands on the desk and reaches up to the
  // measured key-top height.
  const KB = BEAVER_MODEL.keyboard;
  const kbLocal = new Vector3(KB.center[0] - pivot.x, 0, KB.center[1] - pivot.z)
    .multiplyScalar(scale)
    .applyAxisAngle(new Vector3(0, 1, 0), BEAVER_MODEL.fit.yaw);
  const kbTopWorld = rootY + (KB.top - pivot.y) * scale;
  const kbHeight = Math.max(0.02, kbTopWorld - DESK.top);

  return (
    <group position={[BEAVER.position.x + ox, rootY, BEAVER.position.z + oz]}>
      <group ref={character} rotation={[0, BEAVER_MODEL.fit.yaw, 0]} scale={scale}>
        <primitive object={scene} position={[-pivot.x, -pivot.y, -pivot.z]} />
      </group>
      {KB.enabled && (
        <group position={[kbLocal.x, DESK.top - rootY, kbLocal.z]} rotation={[0, BEAVER_MODEL.fit.yaw + KB.yaw, 0]}>
          <PremiumKeyboard shadows={shadows} width={KB.size[0] * scale} depth={KB.size[1] * scale} height={kbHeight} />
        </group>
      )}
    </group>
  );
}
