# 3D models

Place the compressed beaver model here as `beaver.glb` (see the root README,
"Using a real beaver model"). Keep the uncompressed export outside `public/`
as `assets-src/beaver.src.glb` (git-ignored, never deployed) and run
`npm run optimize:model`.

Expected: faces −Z, metres, origin on the floor under the seat, clips named
`Idle`, `Typing`, `Blink`.
