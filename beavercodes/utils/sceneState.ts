/**
 * Per-frame values shared between 3D components. Mutated inside useFrame by
 * <CameraAnimation /> (which runs first, priority -1) and read by everything
 * else in the same frame. Plain object on purpose: no React re-renders.
 */
export const sceneState = {
  /** Smoothed story time, 0 → 1 (see STORY in utils/store). */
  p: 0,
  /** Pointer in NDC (-1 → 1), smoothed — camera parallax & beaver gaze. */
  px: 0,
  py: 0,
  /** Pointer speed, 0 → 1, smoothed — makes the beaver notice quick moves. */
  pointerEnergy: 0,
  /** Scroll velocity, 0 → 1, smoothed and decaying when scrolling stops. */
  vel: 0,
  /** 0 → 1 strength of the dive distortion (lens warp + chroma), per frame. */
  warp: 0,
};
