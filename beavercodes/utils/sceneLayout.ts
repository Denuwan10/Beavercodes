import { Euler, Matrix4, Quaternion, Vector3 } from "three";

/**
 * World-space layout of the workshop. Everything that the camera path or the
 * DOM portal needs to know about (most importantly the monitor screen) is
 * derived here, so moving the monitor automatically re-aims the whole story.
 *
 * Units ≈ metres. The desk is centred on the origin, the beaver sits on +Z
 * facing −Z, and the monitor screen faces the beaver (+Z).
 */

export const DESK = {
  top: 0.76,
  width: 1.9,
  depth: 0.86,
  thickness: 0.045,
};

/**
 * Desktop monitor on a stand near the back of the desk. `center` is the middle
 * of the panel; the panel leans back by `tilt` around its own centre.
 */
export const MONITOR = {
  // Low and set back, so the camera's dive into the screen clears the beaver's head.
  center: new Vector3(0, DESK.top + 0.2, -0.26),
  /** Leans back ~4° from vertical. */
  tilt: -0.07,
  /** Outer panel size (bezel included) and thickness. */
  // A ~21" panel. Much bigger pushes the camera's final approach back into the beaver.
  panelW: 0.47,
  panelH: 0.296,
  panelT: 0.022,
  screenW: 0.448,
  screenH: 0.28, // 16:10, matches the 1280×800 screen texture
  /** Stand foot sits on the desk, behind the panel's centre. */
  footZ: -0.3,
};

const panelQuat = new Quaternion().setFromEuler(new Euler(MONITOR.tilt, 0, 0));
/** World transform of the panel (origin at its centre, facing +Z). */
export const PANEL_MATRIX = new Matrix4().compose(MONITOR.center, panelQuat, new Vector3(1, 1, 1));

/** Screen centre in panel-local space (slightly proud of the front face). */
export const SCREEN_LOCAL_CENTER = new Vector3(0, 0.004, MONITOR.panelT / 2 + 0.0008);

export const SCREEN = (() => {
  const center = SCREEN_LOCAL_CENTER.clone().applyMatrix4(PANEL_MATRIX);
  const normal = new Vector3(0, 0, 1).applyQuaternion(panelQuat).normalize();
  const up = new Vector3(0, 1, 0).applyQuaternion(panelQuat).normalize();
  const right = new Vector3(1, 0, 0);
  const hw = MONITOR.screenW / 2;
  const hh = MONITOR.screenH / 2;
  const corner = (sx: number, sy: number) =>
    center.clone().addScaledVector(right, sx * hw).addScaledVector(up, sy * hh);
  return {
    center,
    normal,
    up,
    width: MONITOR.screenW,
    height: MONITOR.screenH,
    /** TL, TR, BR, BL */
    corners: [corner(-1, 1), corner(1, 1), corner(1, -1), corner(-1, -1)],
  };
})();

export const BEAVER = {
  position: new Vector3(0, 0, 0.66),
};

export const CAMERA_FOV = 34;
