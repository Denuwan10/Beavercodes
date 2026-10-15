/**
 * Everything needed to swap in a new beaver character lives here.
 *
 * Replace /public/models/beaver.glb (or set NEXT_PUBLIC_BEAVER_MODEL) and,
 * if the new file is oriented or proportioned differently, tune `fit`.
 * The loader auto-scales the model to `fit.height` and stands it on the floor
 * at the chair, so most exports work without touching anything else.
 */
export const BEAVER_MODEL = {
  // /models is served as immutable (next.config.ts) — bump ?v= whenever the file changes.
  url: process.env.NEXT_PUBLIC_BEAVER_MODEL || "/models/beaver.glb?v=4",

  /** Draco / Meshopt decoding (gltf-transform optimize output). */
  draco: true,
  meshopt: true,

  fit: {
    /** Seated height, floor → top of head, in metres. */
    height: 1.24,
    /**
     * Yaw in radians so the character faces the laptop (−Z in the scene).
     * glTF's "front" is +Z, so π suits most Blender/Meshy exports. The current
     * Tripo beaver faces +X in its file, so it needs π/2.
     */
    yaw: Math.PI / 2,
    /** Fine placement after auto-fit, metres [x, y, z] in beaver space. */
    offset: [-0.35, 0.24, 0.12] as [number, number, number],
    /**
     * Where the horizontal centre of the bounding box should sit, as a
     * fraction of its depth (0 = front, 1 = back). Seated characters with
     * arms forward and a tail behind are rarely centred on their hips.
     */
    pivotDepth: 0.5,
  },

  /**
   * The premium keyboard under the paws. Tripo modelled the beaver with a plain
   * keyboard fused to its paws; cutting it out tore the fingers and left a hole,
   * so the mesh stays intact and this keyboard is built *around* the baked one,
   * hiding it. All values are in the model's own (unscaled) space, measured from
   * the baked keyboard, so it follows the beaver when `fit` changes:
   *   center  x/z centre of the baked keyboard
   *   size    its length × depth, plus a little margin so it's fully covered
   *   top     height of the new case top — just above the baked key tops
   *           (−0.025), so the fingertips settle among the new keycaps
   *   yaw     turns it to face the paws (front toward the beaver)
   * It always stands on the desk; its height is whatever reaches `top`.
   */
  keyboard: {
    enabled: true,
    center: [0.3293, 0.1622] as [number, number],
    size: [0.402, 0.231] as [number, number],
    top: -0.027,
    yaw: -1.954,
  },

  /** Animation clip name patterns (any subset may exist). */
  clips: {
    idle: /idle|breath|sit/i,
    typing: /typ|keyboard|work/i,
    blink: /blink/i,
  },

  /** Bone name patterns: Mixamo, Meshy/Tripo auto-rigs, Rigify and Blender defaults. */
  bones: {
    head: /^(mixamorig:?)?head$|^head(_|\.)?\d*$|DEF[-_]?head|(^|_)head$/i,
    neck: /neck/i,
    chest: /spine2|spine_?02|chest|upperchest|spine\.003/i,
    eyeL: /(left|l)[_.-]?eye|eye[_.-]?(left|l)\b/i,
    eyeR: /(right|r)[_.-]?eye|eye[_.-]?(right|r)\b/i,
    handL: /(left|l)[_.-]?hand$|hand[_.-]?(left|l)$/i,
    handR: /(right|r)[_.-]?hand$|hand[_.-]?(right|r)$/i,
    forearmL: /(left|l)[_.-]?fore[_.-]?arm|fore[_.-]?arm[_.-]?(left|l)\b|lowerarm[_.-]?l\b/i,
    forearmR: /(right|r)[_.-]?fore[_.-]?arm|fore[_.-]?arm[_.-]?(right|r)\b|lowerarm[_.-]?r\b/i,
  },

  /** Shape-key (morph target) patterns for blinking. */
  morphs: {
    blink: /blink|eyes?[_.-]?closed?|eye[_.-]?close/i,
  },

  /** How strongly the character reacts to the cursor (radians at screen edge). */
  gaze: { head: 0.42, eyes: 0.6, pitch: 0.2 },
};
