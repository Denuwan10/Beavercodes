# Higgsfield asset kit

How the BeaverCodes character and brand media are produced with Higgsfield, and
where each output goes in this project.

## 1. Mascot concept (image)

Model: any Higgsfield image model (Nano Banana Pro or GPT Image give the best
detail; Z Image is the budget option).

> Premium stylized 3D character render, Pixar quality: a friendly professional
> beaver software engineer mascot. Full body, seated pose on an invisible chair,
> both forearms reaching forward with paws at keyboard height as if typing, head
> tilted slightly down looking ahead. Rich warm brown fur, lighter tan muzzle,
> two cream front teeth, small round ears, bright intelligent dark eyes, wide flat
> textured paddle tail behind. Wearing a modern charcoal-black hoodie with orange
> drawstrings and a small orange chest patch. Three-quarter front view, whole
> character visible including feet and tail. No chair, no desk, no laptop, no
> props. Plain seamless light grey studio background, soft even lighting, clean
> silhouette, highly detailed.

Rules that make the 3D step work: full body in frame, no props (the scene
already has the desk, chair and laptop), plain background, even lighting.

Save the best render as `public/higgsfield/beaver-mascot.png` — it appears in
the About section ("Meet the builder") automatically.

### Optional: turnaround views for better geometry

Generate 2–4 more images of the *same* character (use the first render as the
reference image) from: front, left side, back. Multi-view reconstruction gives
much cleaner tails, ears and hood geometry than a single view.

## 2. Character mesh (image → 3D)

| Route | Higgsfield model | Output | Animation in this site |
| --- | --- | --- | --- |
| Budget | `tripo_h3_1_image_to_3d` (PBR on) | Static textured GLB | Whole-body breathing, lean-in, cursor sway (procedural) |
| Better geometry | `tripo_h3_1_multiview_to_3d` or `multi_image_to_3d` | Static textured GLB | Same as above |
| Full character | `image_to_3d` / `meshy_v7_image_to_3d` with `enable_rigging: true` | Rigged GLB | Head + eye tracking, chest breathing, procedural typing on hand bones |
| Full character + clip | add `enable_animation: true` and an `animation_action_id` (search with `animation_actions`, e.g. a seated / typing idle) | Rigged + animated GLB | Authored clip plays through the mixer, procedural layer on top |

Then:

```bash
# put the download at assets-src/beaver.src.glb
npm run optimize:model        # → public/models/beaver.glb (Draco + WebP)
```

That's it — `BeaverModel` finds `/models/beaver.glb`, auto-scales it to the seat,
and swaps out the procedural stand-in. Tune placement in `utils/beaverConfig.ts`
(`fit.height`, `fit.yaw`, `fit.offset`, `fit.pivotDepth`).

Notes on rigs: Meshy's auto-rig is humanoid. A seated beaver rigs acceptably
(head, spine and arm bones are what this site drives); the tail will be skinned
to the hips. For a hand-tuned rig, import the GLB into Blender, add bones named
`Head`, `Neck`, `Spine2`, `LeftHand`, `RightHand`, `LeftForeArm`,
`RightForeArm`, `LeftEye`, `RightEye` (Mixamo names also match), and a `Blink`
shape key.

## 3. Other brand media

| File | Use on the site | Suggested Higgsfield route |
| --- | --- | --- |
| `public/higgsfield/hero-poster.jpg` | Still for social sharing / static fallback | Image model, 16:9, the workspace scene with warm orange practical light |
| `public/higgsfield/showreel.mp4` | Plays in the About mascot card (muted loop) | Image-to-video from the mascot render, 5–8 s, subtle typing + head turn |

All slots are optional and listed in `utils/assets.ts`; missing files are skipped.
