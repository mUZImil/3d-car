# Luxury Car — Phase 1

Minimal Next.js + Three.js foundation for the interactive luxury-car project.

## Current scope

- Next.js App Router
- TypeScript
- Native Three.js (no React Three Fiber)
- Khronos Toy Car GLB as the technical prototype
- Near-black studio background
- Minimal three-light setup
- Perspective camera
- GLB loading through `GLTFLoader`
- Renderer pixel-ratio cap at 2
- Central render loop
- Resize handling
- Basic resource cleanup

## Intentionally not included yet

- Liquid distortion / GLSL
- Mouse interaction
- GSAP
- Post-processing
- GUI controls
- Final luxury-car asset
- Advanced mobile quality tiers

## 1. Install dependencies

```bash
npm install
```

## 2. Download the CC0 prototype asset

The official Khronos Toy Car is CC0 1.0 Universal and is supplied as a GLB in the Khronos glTF Sample Assets repository. citeturn0search0turn0search5

```bash
npm run setup:asset
```

This downloads:

`public/models/toy-car.glb`

The repository intentionally does not redistribute the binary inside this starter archive because the build environment used to create this archive cannot fetch GitHub's binary file directly. The setup command fetches it from the official source.

## 3. Run

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Versions

The starter is pinned to the current stable versions verified during creation:

- Next.js `16.3.2`
- React `19.2.0`
- Three.js `0.185.1`
- TypeScript `^5.8.0`

Three.js `0.185.1` is the current npm `latest` release at the time of creation. citeturn1search0

## Project structure

```text
luxury-car-phase1/
├── public/
│   └── models/
│       └── toy-car.glb        # created by npm run setup:asset
├── scripts/
│   └── download-toy-car.mjs
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       └── CarExperience.tsx
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Next phase

Once this baseline is verified, the next phase should rebuild the car appearance around the studio-black art direction and establish pointer interaction before adding the liquid GLSL pass.
