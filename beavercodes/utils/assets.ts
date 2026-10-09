/**
 * Higgsfield-generated (or any other) brand media. Drop files into
 * /public/higgsfield and point these paths at them. Every slot is optional:
 * components check that the file loads and quietly skip it when it doesn't,
 * so the site never shows a broken image.
 *
 * Suggested Higgsfield outputs:
 *   mascot     — square character render of the BeaverCodes beaver (PNG/WebP)
 *   heroPoster — 16:9 still of the workspace, used when the 3D intro is off
 *                (reduced motion, no WebGL) and as the social share image
 *   showreel   — short promotional loop (MP4/WebM, muted, < 8 MB)
 */
export const BRAND_MEDIA = {
  mascot: "/higgsfield/beaver-mascot.png",
  heroPoster: "/higgsfield/hero-poster.jpg",
  showreel: "/higgsfield/showreel.mp4",
} as const;
