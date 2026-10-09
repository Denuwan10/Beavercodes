"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from "three";
import { CAMERA_FOV, SCREEN } from "@/utils/sceneLayout";
import { sceneState } from "@/utils/sceneState";
import { experience, STORY } from "@/utils/store";
import { damp, range, smoothstep } from "@/utils/math";

/**
 * Size of the region on the laptop display that hosts the DOM website. It
 * always matches the browser viewport's aspect ratio (letter-boxed inside the
 * 16:10 display), so the site maps onto it without distortion — on phones it
 * appears as a tall "mobile preview" inside the laptop.
 */
export function portalHalfSize(aspect: number) {
  const screenAspect = SCREEN.width / SCREEN.height;
  if (aspect >= screenAspect) {
    const hw = SCREEN.width / 2;
    return { hw, hh: hw / aspect };
  }
  const hh = SCREEN.height / 2;
  return { hw: hh * aspect, hh };
}

/** Distance from the screen at which the portal exactly fills the viewport. */
export function fillDistance(aspect: number) {
  const { hh } = portalHalfSize(aspect);
  return hh / Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180);
}

/** Smoothed camera target, shared with depth-of-field. */
export const cameraTarget = new Vector3(0, 1, 0.3);

/**
 * Story beats → camera keyframes. Positions and look-at targets run along
 * centripetal Catmull-Rom splines; story time is mapped piecewise onto spline
 * time so each beat lands exactly on its stamp.
 *
 *   0.00        wide establishing shot across the laptop at the beaver
 *   0.00–0.25   slow push-in, workspace still fully readable, beaver coding
 *   0.25–0.50   arc round to behind the beaver's shoulder; laptop takes over
 *   0.50–0.80   rise over his head, line up with the display, dive through it
 */
function buildPath(aspect: number) {
  const n = SCREEN.normal;
  const c = SCREEN.center;
  const dFill = fillDistance(aspect);
  const at = (d: number) => c.clone().addScaledVector(n, d);

  const stamps = [0, 0.13, 0.25, 0.38, 0.5, 0.6, 0.7, 0.8];
  const positions = [
    new Vector3(-2.15, 1.62, -3.05),
    new Vector3(-1.95, 1.52, -2.35),
    new Vector3(-2.15, 1.46, -1.25),
    new Vector3(-1.85, 1.55, 0.85),
    // Over his left shoulder (+X) — the beaver sits off to −X, so this side is clear.
    new Vector3(0.42, 1.48, 1.05),
    // ...then past his cheek to line up with the monitor, in front of his face.
    new Vector3(0.26, 1.24, 0.3),
    at(dFill + 0.12),
    at(dFill * 0.995),
  ];
  const targets = [
    new Vector3(0, 0.98, 0.38),
    new Vector3(0, 0.98, 0.36),
    new Vector3(0, 0.97, 0.32),
    new Vector3(0, 0.93, 0.12),
    c.clone(),
    c.clone(),
    c.clone(),
    c.clone(),
  ];
  return {
    stamps,
    pos: new CatmullRomCurve3(positions, false, "centripetal", 0.5),
    tgt: new CatmullRomCurve3(targets, false, "centripetal", 0.5),
  };
}

function storyToSpline(p: number, stamps: number[]) {
  const last = stamps.length - 1;
  if (p <= 0) return 0;
  if (p >= stamps[last]) return 1;
  for (let i = 0; i < last; i++) {
    if (p <= stamps[i + 1]) {
      const local = (p - stamps[i]) / (stamps[i + 1] - stamps[i]);
      return (i + local) / last;
    }
  }
  return 1;
}

const pointer = { x: 0, y: 0, energy: 0, lastX: 0, lastY: 0 };
const velTrack = { value: -1, since: 0 };
const tmpPos = new Vector3();
const tmpTgt = new Vector3();

export default function CameraAnimation({ parallax }: { parallax: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const path = useMemo(() => buildPath(aspect), [aspect]);

  useEffect(() => {
    camera.fov = CAMERA_FOV;
    camera.near = 0.01;
    camera.far = 40;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Pointer drives camera parallax (desktop) and the beaver's gaze (all devices).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.energy = Math.min(1, pointer.energy + Math.hypot(x - pointer.lastX, y - pointer.lastY) * 2.5);
      pointer.lastX = pointer.x = x;
      pointer.lastY = pointer.y = y;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // priority -1: runs before every other frame subscriber
  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const { story, velocity } = experience.get();

    // GSAP scrub already eases story time; a light extra damp removes any
    // remaining frame-to-frame jitter from trackpads.
    sceneState.p = Math.abs(story - sceneState.p) < 0.0003 ? story : damp(sceneState.p, story, 7, dt);
    sceneState.px = damp(sceneState.px, pointer.x, 2.2, dt);
    sceneState.py = damp(sceneState.py, pointer.y, 2.2, dt);
    pointer.energy = damp(pointer.energy, 0, 1.6, dt);
    sceneState.pointerEnergy = pointer.energy;

    // Scroll velocity: ScrollTrigger only reports while scrolling, so decay
    // to zero once the value stops changing.
    if (velocity !== velTrack.value) {
      velTrack.value = velocity;
      velTrack.since = t;
    }
    const velTarget = t - velTrack.since > 0.12 ? 0 : velocity;
    sceneState.vel = damp(sceneState.vel, velTarget, 4, dt);

    const p = sceneState.p;
    const u = storyToSpline(p, path.stamps);
    path.pos.getPoint(u, tmpPos);
    path.tgt.getPoint(u, tmpTgt);

    // Handheld drift + pointer parallax; both vanish as we line up with the screen.
    const free = 1 - range(p, 0.38, 0.55);
    const par = parallax ? 1 : 0;
    tmpPos.x += (Math.sin(t * 0.31) * 0.025 + sceneState.px * 0.14 * par) * free;
    tmpPos.y += (Math.sin(t * 0.47) * 0.015 + sceneState.py * 0.07 * par) * free;
    tmpTgt.x += sceneState.px * 0.03 * par * free;

    camera.position.copy(tmpPos);
    cameraTarget.copy(tmpTgt);
    camera.lookAt(cameraTarget);

    // Dive: a gentle Dutch roll that resolves to level as we hit the glass.
    const dive = range(p, STORY.focusEnd, STORY.diveEnd);
    camera.rotateZ(Math.sin(dive * Math.PI) * 0.035);

    // Fast scrolling breathes the lens (dolly-zoom feel), never during the final lock-up.
    const lock = 1 - range(p, 0.66, 0.78);
    const fov = CAMERA_FOV + sceneState.vel * 3.2 * lock;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Lens warp peaks just before we pass through the display.
    const bell = smoothstep(range(p, 0.6, 0.73)) * (1 - smoothstep(range(p, 0.75, STORY.diveEnd)));
    sceneState.warp = Math.min(1, bell + sceneState.vel * 0.35 * range(p, 0.5, 0.7) * lock);

    camera.updateMatrixWorld();
  }, -1);

  return null;
}
