# BeaverCodes — Build • Develop • Grow

Cinematic, scroll-driven agency website. A beaver developer codes at his desk; as you
scroll, the camera orbits behind him, the laptop lights up, the camera dives into the
display — and the display **becomes** the real website. No video, no hard cut: the live
DOM homepage is projected onto the 3D screen every frame and grows until it is the page.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Three.js ·
React Three Fiber · drei · postprocessing · GSAP + ScrollTrigger · Framer Motion · Lenis

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 18.18+ (20+ recommended). Deploy by importing the repo into Vercel — no config needed.

Optional environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BEAVER_MODEL` | Override the character path (default `/models/beaver.glb`). If the file is missing, the procedural beaver is used. |
| `NEXT_PUBLIC_HDR_URL` | Path to an `.hdr` environment (e.g. `/hdr/studio_1k.hdr`). Unset = procedural studio light. |
| `CONTACT_WEBHOOK_URL` | Where `/api/contact` forwards enquiries (Slack, Zapier, Make, CRM…). |

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, Lenis + custom cursor providers
  page.tsx              section composition
  globals.css           Tailwind v4 @theme tokens, grain, utilities
  api/contact/route.ts  validated contact endpoint (+ honeypot)
components/
  Hero3D.tsx            pinned scroll stage: canvas + story HUD + DOM portal
  BeaverScene.tsx       R3F <Canvas>, adaptive quality, scene composition
  LandingHero.tsx       the real homepage hero (lives on the laptop, then the page)
  IntroHud.tsx          chapter titles, scroll cue, progress rail
  Preloader.tsx         loading curtain, waits for first rendered frame
  Navbar.tsx            intro → site mode, active-section pill, mobile menu
  Services / Portfolio / WhyUs / Process / About / Contact / Footer
  MagneticButton, RevealText, ScrubText, SectionHeading, Cursor, Logo
  three/
    BeaverModel.tsx     GLB loader with procedural fallback (breathing, blinking, typing)
    CameraAnimation.tsx scroll → spline camera; portal sizing helpers
    ScreenPortalSync.tsx projects the DOM site onto the 3D display (CSS matrix3d)
    SceneLighting.tsx   key / lamp / rim / wall lights + environment
    Laptop.tsx          laptop with live canvas-texture display
    ScreenTexture.ts    self-typing code editor + product previews (2D canvas)
    Workspace.tsx       desk, chair, mug + steam, plant, notebook, lamp, room
    Particles.tsx       GPU dust motes (custom shader)
    CodeSymbols.tsx     floating code glyph sprites
    Effects.tsx         DOF + bloom + vignette + tone mapping (desktop)
hooks/   useDeviceTier (adaptive quality), useLenis, useIsomorphicLayoutEffect
utils/   store (scroll progress + STORY beats), sceneLayout (world geometry), math
```

---

## How the hero works

1. **Scroll → story time.** `Hero3D` pins the stage and scrubs a GSAP timeline
   (`scrub: 1.1`) that tweens a single `story` value through four beats, each with its
   own ease (`STORY_TIMELINE` in `utils/store.ts`): a gentle sine approach, a
   `power2.inOut` orbit that settles on the laptop, a `power3.in` pull into the
   screen, and a soft `power2.out` landing. Scroll velocity is stored too.
2. **Story → camera.** `CameraAnimation` samples centripetal Catmull-Rom splines for
   position and look-at; the camera breathes its FOV with scroll velocity, adds a
   slight Dutch roll through the dive (resolving to level at the glass), and
   handheld drift + pointer parallax before the shot locks up.

   | Scroll | Beat |
   | --- | --- |
   | 0% | Wide establishing shot across the laptop at the beaver |
   | 0–25% | Full workspace, beaver coding; slow push-in; light warms; UI cards, glyphs and particles appear |
   | 25–50% | Arc behind the beaver's shoulder; display glow + cover-glass reflections; UI previews on screen |
   | 50–80% | Rise over his head, dive into the display: lens warp, chromatic split, streaks, warm light bloom |
   | 80–100% | The display is now the viewport — the real homepage |

3. **The portal.** `ScreenPortalSync` projects the four corners of the laptop display to
   screen pixels every frame and builds a projective `matrix3d` so the DOM `LandingHero`
   sits on the 3D screen with correct perspective. The portal region always matches the
   viewport's aspect ratio (on phones it shows as a tall mobile preview inside the
   laptop), so at the end of the dive it lines up with the viewport exactly; the last
   7% blends the transform to identity and the canvas fades out. Then the WebGL loop
   stops (`frameloop="never"`) until you scroll back.

Tune timing in `utils/store.ts` (`STORY`), camera keyframes in
`components/three/CameraAnimation.tsx`, scene placement in `utils/sceneLayout.ts`
(moving the laptop re-aims the whole dive automatically).

---

## The beaver character

`components/three/BeaverModel.tsx` loads `/public/models/beaver.glb` (path and fit in
`utils/beaverConfig.ts`). Replace that one file to change the character.

| What the GLB contains | What you get |
| --- | --- |
| Static mesh (e.g. image-to-3D) | Auto-fit to the seat, breathing, lean-in, cursor-reactive sway |
| + skeleton | + head turns and eye tracking toward the cursor, chest breathing, procedural typing on hand/forearm bones |
| + `Idle` / `Typing` clips | Authored clips through the AnimationMixer, procedural layer on top |
| + `Blink` clip or blink shape key | Natural blinking with occasional double-blinks |

If the file is missing or fails to load, `ProceduralBeaver` (code-built, same behaviour
layer) is shown, so the site never breaks. Higgsfield prompts and the image → 3D →
rig workflow are in `docs/higgsfield-assets.md`.

## Using a real beaver model (Blender → GLB)

The procedural beaver means the site ships with zero 3D assets. To use a sculpted,
rigged character:

1. **Model & rig in Blender** — beaver seated, hoodie, paws over a keyboard.
   - Units: metres, scale applied (`Ctrl+A → Scale`). Seat height ≈ 0.45 m.
   - Orientation: the beaver must face **−Z** in three.js (in Blender with "+Y Up" export
     that means facing **+Y**). Origin on the floor directly below the seat.
2. **Animations** (NLA actions, any subset): `Idle` (breathing / head drift), `Typing`,
   `Blink`. They are cross-faded and layered automatically.
3. **Export** `File → Export → glTF 2.0`: format *glTF Binary*, +Y Up, Apply Modifiers,
   include animations, sample rate 30. Save as `assets-src/beaver.src.glb` (outside `public/`, so it's never deployed).
4. **Compress**: `npm run optimize:model` (Draco geometry + WebP textures at 2048).
   Aim for < 2–3 MB.
5. That's all: the loader picks up `/models/beaver.glb` automatically. The procedural
   beaver is shown while it streams.

For an HDR environment, drop a 1k `.hdr` (e.g. from Poly Haven) in `public/hdr/` and set
`NEXT_PUBLIC_HDR_URL`.

---

## Performance strategy

- WebGL bundle is code-split (`next/dynamic`, `ssr: false`) and loaded after first paint.
- Device tiers (`hooks/useDeviceTier.ts`): **high** = shadows, DOF, bloom, 520 particles;
  **mid** = static shadow map, no post; **low/mobile** = no real-time shadows, DPR ≤ 1.25,
  fewer particles. `PerformanceMonitor` drops DPR and post effects if FPS sags.
- Laptop display repaints at ~12 fps and freezes once the DOM portal covers it.
- Render loop stops entirely once the intro is complete.
- All scroll-driven DOM updates write styles directly via refs.
- `prefers-reduced-motion` or no WebGL → static landing hero, no pin, no custom cursor.

---

## Before launch — replace placeholders

- `hello@beavercodes.com` (Navbar, Contact) and social links in `Footer.tsx`.
- Portfolio previews are illustrative, code-drawn mockups (`ProjectPreviews.tsx`) — swap
  in real screenshots/case studies.
- Stats in `LandingHero.tsx` (50+ / 30+ / 4) and the `metadataBase` URL in `app/layout.tsx`.
- Set `CONTACT_WEBHOOK_URL` (or swap the forward in `app/api/contact/route.ts` for an
  email provider like Resend).
