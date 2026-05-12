# Luxurio — Master Project Plan
> *"Shirt on guy." Build ugly. Build real. Build now.*

---

## Philosophy

This is a toy project first. No investors. No users. No scale. No auth. No databases. No cloud.  
The only goal right now is: **can we render a shirt on a 3D human body in a browser?**  
Everything else is future noise. Kill it until it's needed.

---

## Phase 0 — Hello World (Done ✓)

**Goal:** Repo exists. Both devs can run the project locally.

- [x] React + TypeScript + Vite scaffold
- [x] GitHub repo initialized (`closet-engine`)
- [x] Both devs cloned and running
- [x] "Hello World" renders in browser

**Exit Criteria:** `npm run dev` works on both machines.

---

## Phase 1 — The Scene (Milestone: Cube in Browser)

**Goal:** Prove the 3D rendering pipeline works end-to-end in browser.

### Tasks
- Set up React Three Fiber (`@react-three/fiber`)
- Set up Drei helpers (`@react-three/drei`) — OrbitControls, Environment, etc.
- Render a basic 3D cube with lighting
- Add orbit controls (mouse drag to rotate)
- Set up project folder structure:
  ```
  src/
    components/   ← reusable 3D + UI pieces
    scenes/       ← full scene compositions
    models/       ← GLB loaders, avatar logic
    ui/           ← sliders, panels, buttons
    assets/       ← GLB files, textures
    utils/        ← helper functions
  ```
- Commit each working step separately

### Stack
- `@react-three/fiber` — R3F core
- `@react-three/drei` — helpers (OrbitControls, useGLTF, etc.)
- `three` — underlying WebGL

### Exit Criteria
A rotating 3D cube visible in browser. Camera orbits with mouse. Lighting is visible.

---

## Phase 2 — The Body (Milestone: Mannequin in Browser)

**Goal:** Replace cube with an actual humanoid mannequin mesh. The avatar is alive.

### Tasks
- Source or create a base mannequin mesh in Blender
  - Gender-neutral or male base body
  - Proper UV unwrap
  - Minimal poly count (performance)
  - Export as `.glb`
- Load GLB in R3F using `useGLTF`
- Position and scale correctly in scene
- Tune lighting for visibility (ambient + directional)
- Add a ground plane / subtle shadow

### Blender Pipeline (Raj)
- Create or import mannequin base mesh
- Clean topology (loops for morphing later)
- Proper UV map layout
- Export `.glb` to `src/assets/models/mannequin.glb`

### Exit Criteria
A humanoid mannequin renders in browser. Camera orbits it. No sliders yet.

---

## Phase 3 — The Slider (Milestone: Body Morphs)

**Goal:** One slider that visibly changes the mannequin's body shape.

### Concept
Using **morph targets** (shape keys in Blender) — the mesh has baked-in deformation states that can be blended in real-time via a 0–1 value.

### Tasks
- In Blender: create shape keys on mannequin
  - Start with one: `waist_width` or `shoulder_width`
  - Export as GLB with morph targets
- In R3F: read morph target from loaded model
- Build a simple `<BodySlider />` UI component
  - HTML `<input type="range">` styled minimally
  - On change → update morph target influence value
- Wire slider → avatar mesh deformation

### Slider Targets (future, not now)
Height, waist, shoulders, chest, hip, skin tone, face shape

### Exit Criteria
One slider. Move it. Mannequin body visibly changes shape in real-time.

---

## Phase 4 — The Shirt (Milestone: Texture on Clothing Mesh)

**Goal:** Upload a photo of a shirt. It appears on the mannequin. This is the core product moment.

### Concept
- Predefined **clothing mesh** for each garment type (T-shirt, hoodie, jeans, etc.)
- User uploads front (+ optionally back) photo of their real clothing
- System does **background removal → texture extraction**
- Texture is mapped onto the clothing mesh via UV projection
- Clothing mesh sits on top of mannequin in scene

### Tasks

**Clothing Mesh (Blender — Raj)**
- Model a T-shirt mesh that fits over mannequin
- UV unwrap the T-shirt mesh (front panel + back panel)
- Export as `tshirt.glb`

**Texture Pipeline (Krishang)**
- Build `<ClothingUploader />` UI component
- On upload: display image preview
- Background removal: use `remove.bg` API or `@imgly/background-removal` (local WASM)
- Extract texture from removed-background image
- Apply as `THREE.Texture` to clothing mesh material

**Scene Integration**
- Load `tshirt.glb` mesh
- Position it over mannequin
- Apply extracted texture to mesh material

### Exit Criteria
User uploads a phone photo of their T-shirt. The shirt texture appears on the mannequin's torso. It looks rough but it works.

---

## Phase 5 — The Wardrobe (Milestone: Multiple Items, Mix & Match)

**Goal:** Users can upload and switch between multiple clothing items.

### Tasks
- Wardrobe state system (React context or Zustand store)
  - Store uploaded clothing items with metadata
  - Each item: texture, mesh type, name, thumbnail
- `<WardrobePanel />` — sidebar showing saved clothing items
- Click item → applies to mannequin slot (top, bottom, etc.)
- Support at least 2 slots: top + bottom
- Add `pants.glb` / `jeans.glb` mesh to Blender pipeline
- Outfit state: { top: item | null, bottom: item | null }
- Outfit preview: mannequin renders both simultaneously

### Exit Criteria
User has 3 uploaded shirts and 2 pants. They click combinations. Mannequin updates in real-time. 20 combos visible without physically changing clothes.

---

## Phase 6 — Polish & Handoff (Milestone: Shareable Demo)

**Goal:** Make it demo-able to other humans. Not production. Not launch. Just showable.

### Tasks
- UI polish pass — layout, spacing, color scheme
- Camera presets (front view, side view, 3/4 view)
- Screenshot/export button (canvas `.toDataURL()`)
- README update with screenshots and demo GIF
- Refactor messy code from earlier phases
- Optional: basic localStorage persistence for wardrobe items

### Out of Scope (DO NOT TOUCH)
- Authentication
- User accounts
- Cloud storage
- Payment / monetization
- Mobile optimization
- AI stylist
- Social sharing
- Shopping APIs

### Exit Criteria
You can hand a laptop to someone unfamiliar with the project. They can upload a photo of a shirt, put it on the mannequin, try a different pair of pants, and understand what this is — in under 2 minutes.

---

## Technology Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Framework | React + Vite + TypeScript | Fast dev, modern, team familiarity |
| 3D Renderer | React Three Fiber + Three.js | React-native 3D, large ecosystem |
| 3D Helpers | @react-three/drei | OrbitControls, loaders, shortcuts |
| 3D Authoring | Blender | Free, powerful, GLB export |
| Background Removal | @imgly/background-removal (WASM) | Client-side, no API key needed for MVP |
| State Management | React useState → Zustand later | Start simple |
| Styling | CSS Modules or Tailwind | TBD Phase 3 |
| Deployment | Vercel / Netlify (future) | Not needed until Phase 6 |

---

## Mental Model: Unity → R3F Mapping

| Unity | React Three Fiber |
|---|---|
| Scene | `<Canvas>` |
| GameObject | `<mesh>` |
| Transform | position / rotation / scale props |
| Material | `<meshStandardMaterial>` |
| Update() | `useFrame()` hook |
| Prefab | Reusable React component |
| Inspector | dat.GUI or Leva |
| Asset Import | `useGLTF()` hook |

---

## Anti-Patterns to Avoid

- ❌ Researching for 3 days before writing code
- ❌ Building auth before having a working 3D scene
- ❌ Waiting for perfect Blender mesh before testing R3F
- ❌ TypeScript becoming a blocker — use `any` and move on
- ❌ Premature state management architecture
- ❌ Worrying about mobile / responsive before desktop works
- ❌ Starting Phase N+1 before Phase N has an exit criteria met

---

## GitHub Commit Style

```
feat: render cube in browser with orbit controls
feat: import mannequin GLB model
feat: add waist morph target slider
feat: clothing upload and texture extraction
fix: mannequin z-fighting with shirt mesh
chore: restructure src directories
docs: update README with phase 1 screenshot
```

Small. Frequent. Descriptive.
