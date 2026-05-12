# MirrorSim

**A browser-based 3D wardrobe simulator. Try your clothes without wearing them.**

> Upload a photo of any shirt. Watch it appear on your avatar. Mix outfits in seconds — not minutes.

---

## The Problem

You have 5 T-shirts and 4 jeans. That's 20 outfit combinations. Trying each one physically means 20 clothing changes. Most people give up and default to the same 3 outfits.

MirrorSim solves this with a Sims-style digital wardrobe — a 3D avatar that wears your clothes so you don't have to.

---

## What This Is (and Isn't)

**This is:** A personal wardrobe visualization tool. Upload photos of your actual clothes — thrifted, flea market, hand-me-downs, anything — and preview them on a customizable 3D avatar.

**This is not:** A shopping app. Not an e-commerce platform. Not a catalog tool. Your clothes, your avatar, your wardrobe.

---

## Current Status

> 🟡 Early prototype — actively building

| Phase   | Status        | Description                        |
| ------- | ------------- | ---------------------------------- |
| Phase 0 | ✅ Done        | React + Vite + TypeScript scaffold |
| Phase 1 | 🔨 In Progress | 3D scene with orbit controls       |
| Phase 2 | ⏳ Pending     | Mannequin mesh in browser          |
| Phase 3 | ⏳ Pending     | Body morphing sliders              |
| Phase 4 | ⏳ Pending     | Shirt texture upload pipeline      |
| Phase 5 | ⏳ Pending     | Full wardrobe switching            |
| Phase 6 | ⏳ Pending     | Polish and demo                    |

---

## How It Works

```
Upload shirt photo
       │
       ▼
Background removal (client-side, no API needed)
       │
       ▼
Texture mapped onto 3D clothing mesh
       │
       ▼
Clothing mesh renders on your customized avatar
```

No reconstruction of 3D geometry. No AI-generated shapes. Just your shirt's texture, mapped onto a predefined mesh, in real time.

---

## Tech Stack

| Layer              | Tool                                        |
| ------------------ | ------------------------------------------- |
| Framework          | React + TypeScript + Vite                   |
| 3D Rendering       | React Three Fiber + Three.js                |
| 3D Helpers         | @react-three/drei                           |
| 3D Authoring       | Blender (asset pipeline)                    |
| Background Removal | @imgly/background-removal (runs in browser) |
| State              | React useState → Zustand (later)            |

---

## Running Locally

```bash
git clone https://github.com/your-username/closet-engine
cd closet-engine
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
src/
  components/     ← 3D mesh components (avatar, clothing)
  scenes/         ← full scene compositions
  ui/             ← sliders, upload panels, wardrobe
  store/          ← avatar and wardrobe state
  utils/          ← texture pipeline, morph target helpers
  assets/         ← GLB models, textures
```

---

## Roadmap

- [ ] Mannequin renders in browser with orbit controls
- [ ] Body shape sliders (waist, shoulders, height)
- [ ] Shirt photo upload → texture on avatar
- [ ] Wardrobe panel — save and switch outfits
- [ ] Pants / jeans mesh support
- [ ] Camera presets + screenshot export
- [ ] Travel packing mode (pack for N days, N outfits)
- [ ] AI outfit suggestions (far future)

---

## Team

| Dev      | Focus                                                      |
| -------- | ---------------------------------------------------------- |
| Krishang | React Three Fiber · texture pipeline · UI                  |
| Raj      | Blender · mannequin mesh · clothing assets · morph targets |

---

## Philosophy

> *"Ugly working prototype > polished fantasy."*

This started as a personal pain point during travel packing. It's a toy project first — no auth, no backend, no scale. The only goal right now is: can we render a shirt on a 3D body in a browser?

Everything else is future noise.

---

## Inspiration

- The Sims character creator
- GTA / RPG body customization sliders
- The frustration of packing for a trip

---

*Not affiliated with any fashion brand, shopping platform, or e-commerce service.*
