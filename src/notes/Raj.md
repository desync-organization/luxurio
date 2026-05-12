# raj.md — Your Work
> Blender · Mannequin Mesh · Clothing Meshes · UV Maps · Morph Targets · GLB Export

---

## Your Role

You own the **3D asset pipeline** for MirrorSim.  
Krishang builds the browser renderer. You build the things that get rendered.  
You are the **technical artist** — half 3D sculptor, half systems thinker.

Your output for every phase: a `.glb` file that Krishang drops into `public/models/` and the browser immediately loads.

Think of your job like a **game asset pipeline**:
- Level designer hands assets to the engine programmer
- Assets must be clean, named correctly, and exported right
- Bad naming = Krishang's code breaks
- Bad topology = morph targets won't work
- Bad UVs = textures look wrong

Communication and naming conventions are as important as the mesh quality.

---

## Your Toolchain

| Tool | What for |
|---|---|
| Blender (3.x or 4.x) | Everything — mesh creation, UV maps, shape keys, GLB export |
| Blender glTF Exporter | Built-in — File → Export → glTF 2.0 |
| Sketchfab (optional) | Finding free base meshes to start from |
| MixamoBody (optional) | Another free humanoid base |
| ReadyPlayerMe (optional) | Quick humanoid GLB export for early testing |

---

## Phase 1 Tasks — Research & Setup
*Parallel to Krishang getting a cube rendering*

### 1.1 — Learn Blender Fundamentals (Problem-First)
Only learn what Phase 2 requires. Minimum viable Blender knowledge:
- Navigation: middle-mouse orbit, scroll zoom, numpad views
- Object vs Edit mode (Tab to toggle)
- Extrude, Scale, Grab (E, S, G)
- UV Unwrapping basics
- GLB export settings

**DO NOT** spend more than 2 days on this. If stuck, use a pre-made base mesh.

### 1.2 — Source or Create Base Mannequin
**Option A (Recommended for speed):** Download a free humanoid GLB/OBJ  
- Sketchfab → search "mannequin" → filter by free license
- ReadyPlayerMe → create avatar → download as GLB
- Mixamo → pick a character → download T-pose as FBX → import to Blender → export GLB

**Option B (More control):** Build a low-poly humanoid from scratch  
- Start with a cube
- Extrude to form rough body proportions
- No need for detail — this is a technical mesh, not art

### 1.3 — Evaluate Your Base Mesh
Before doing anything else, check:
- [ ] Can it load in browser? (Drag GLB into https://gltf.pmnd.rs/ to preview)
- [ ] Is it roughly human proportions?
- [ ] Is the polycount reasonable? (Under 20k triangles is fine)
- [ ] Is it in T-pose? (Arms out, standing, facing +Y or +Z)

### 1.4 — Send First GLB
Even if it's just a rough mannequin with no morph targets — send Krishang the raw GLB.
Early. Ugly. Working.

```
feat: add initial mannequin GLB (raw, no morphs yet)
```

---

## Phase 2 Tasks — Clean the Mannequin
*Goal: A proper rigged mesh ready for morphing*

### 2.1 — Topology Check
For morph targets to work cleanly, the mesh needs:
- **Edge loops** around key deformation zones: waist, chest, shoulders, neck
- No non-manifold geometry (Edit Mode → Select All → Mesh → Clean Up → Merge by Distance)
- No floating vertices

This doesn't need to be perfect. Good enough to deform believably.

### 2.2 — UV Unwrap
In Edit Mode:
- Select all faces (A)
- UV → Smart UV Project (or manual seams + Unwrap)
- Check UV editor — make sure no major overlaps
- This UV map is used for skin tone and future texture painting

### 2.3 — Naming Convention
**This is critical.** Name the main body mesh exactly: `Body`

```
In Blender Outliner:
  └── Scene Collection
        └── Mannequin            ← Object name (doesn't matter)
              └── Body            ← Mesh name (MUST match this)
```

Krishang's code will reference `nodes.Body`. If you name it something else, his code breaks. Confirm naming before export.

### 2.4 — Export GLB v1
File → Export → glTF 2.0:
- Format: **GLB** (binary)
- Include:
  - [x] Mesh
  - [x] UVs
  - [x] Normals
  - [ ] Armature / Rig (NOT needed yet)
  - [ ] Animations (NOT needed)
- Filename: `mannequin_v1.glb`

Always version-suffix exports. Never overwrite.

### 2.5 — Verify in Browser
Drop `mannequin_v1.glb` into https://gltf.pmnd.rs/  
Check:
- Renders correctly
- Roughly correct proportions and orientation
- No missing faces or inverted normals

### 2.6 — Send to Krishang
Drop into `public/models/mannequin_v1.glb` via GitHub commit.
```
feat: clean mannequin mesh v1 with proper UV and naming
```

---

## Phase 3 Tasks — Morph Targets (Shape Keys)
*Goal: Sliders can deform the mannequin's body shape*

### 3.1 — Understanding Shape Keys
Shape Keys in Blender = Morph Targets in GLB = what sliders control in browser.

Each shape key is a **stored deformation state** of your mesh.  
At value 0: the mesh looks like the base  
At value 1: the mesh looks like the deformed version  
The browser can blend between them in real-time.

### 3.2 — Create Your First Shape Key
In Blender:
1. Select the mannequin mesh
2. Properties → Object Data Properties → Shape Keys
3. Click `+` → Creates `Basis` (this is the default shape)
4. Click `+` again → Creates `Key 1`
5. **Rename** `Key 1` to `waist_narrow`
6. Make sure `waist_narrow` is selected
7. Enter Edit Mode
8. Select waist vertices
9. Scale inward: S → X → 0.85 → Enter (or use proportional editing)
10. Exit Edit Mode
11. In the Shape Keys panel, move the `waist_narrow` value slider to see it deform

### 3.3 — Recommended First Shape Keys
Start with ONE. Add more after confirming it works in browser.

Priority order:
1. `waist_narrow` — waist scale in X and Z
2. `shoulders_wide` — shoulder scale in X
3. `chest_large` — chest scale
4. `height_tall` — full body scale in Y (tricky — start last)

### 3.4 — Naming Convention for Shape Keys
These names become the keys in `morphTargetDictionary` in Krishang's code:
```
nodes.Body.morphTargetDictionary = {
  "waist_narrow": 0,
  "shoulders_wide": 1,
  ...
}
```

Use `snake_case`. No spaces. Communicate the exact names to Krishang.

### 3.5 — Export with Morph Targets
File → Export → glTF 2.0:
- Format: GLB
- Under **Mesh**:
  - [x] Shape Keys ← THIS IS THE IMPORTANT ONE
- Filename: `mannequin_v2_morphs.glb`

### 3.6 — Verify in GLTF Viewer
Open https://gltf.pmnd.rs/  
On the right panel, look for "Morph Targets" section  
You should be able to drag the `waist_narrow` slider and see the mesh deform in the viewer  

### 3.7 — Send to Krishang
```
feat: mannequin v2 with waist shape key morph target
note: shape key named exactly "waist_narrow"
```

---

## Phase 4 Tasks — Clothing Mesh
*Goal: A T-shirt mesh that sits over the mannequin and accepts texture*

### 4.1 — The Core Concept
The clothing mesh is NOT the user's actual shirt shape.  
It's a **predefined template** that sits on top of the mannequin and receives the user's texture.

You're building a reusable template, not a bespoke item.

### 4.2 — T-Shirt Mesh Construction
Method 1 (Recommended): **Shrinkwrap from mannequin**
1. Duplicate the mannequin's torso area (`Shift+D` on selected faces)
2. Separate into new object (`P → Separate`)
3. Add slight offset: Select all → Scale 1.02 (makes it sit above skin)
4. Clean up: keep only torso/sleeve area, delete legs/head polygons
5. Fill any holes (`F` to fill)

Method 2: Model from scratch using simple geometry

### 4.3 — T-Shirt UV Map (Critical)
This is the most important step for texture mapping.

The shirt texture the user uploads is a flat photograph.  
The UV map tells Three.js how to stretch that flat photo onto the 3D shirt shape.

Goal: **Front-facing UV map**
- In Edit Mode, select all shirt faces
- UV → Project from View (Front view — Numpad 1)
- This creates a UV map where the front of the shirt = top of UV space

In UV Editor, it should look roughly like an unfolded shirt, with the front panel spanning most of the 0–1 UV space.

### 4.4 — Naming Convention
Name the shirt mesh: `Shirt`

```
Outliner:
  └── TShirt             ← Object name
        └── Shirt         ← Mesh name (Krishang references this)
```

### 4.5 — Export
Filename: `tshirt_v1.glb`

Export settings:
- [x] Mesh
- [x] UVs
- [x] Normals
- [ ] Shape Keys (not needed for shirt yet)

### 4.6 — Verify
In https://gltf.pmnd.rs/ → check the shirt mesh looks right, no inverted normals

### 4.7 — Send to Krishang
```
feat: tshirt clothing mesh v1 with UV mapping
note: mesh object named "Shirt", UV projection from front view
```

---

## Phase 5 Tasks — Additional Clothing
*Goal: Jeans mesh*

Repeat the Phase 4 process for:
- `jeans_v1.glb` — mesh name: `Pants`
- Focus on legs area of mannequin
- UV Project from front view, lower body

---

## The Checklist Before Every Export

Before handing any GLB to Krishang, verify:
- [ ] Correct mesh name (Body / Shirt / Pants)
- [ ] No non-manifold geometry (Mesh → Clean Up → Merge by Distance)
- [ ] Normals facing outward (Edit Mode → Overlay → Face Orientation — should be blue)
- [ ] UV map is set up
- [ ] Previews correctly in https://gltf.pmnd.rs/
- [ ] Shape keys visible in viewer (if applicable)
- [ ] Version-suffixed filename

---

## Communication Protocol with Krishang

Every GLB you send, include a note:

```
File: mannequin_v2_morphs.glb
Mesh name: Body
Shape Keys:
  - waist_narrow (index 0)
  - shoulders_wide (index 1)
UV: SmartUV projection, one UV map named "UVMap"
Scale: 1 Blender unit = 1 meter
Orientation: Facing +Z, standing on Y=0 plane
```

This lets Krishang write the correct code without guessing.

---

## Blender Learning Resources (Minimum Required)

| Topic | Resource |
|---|---|
| Blender basics | Blender Guru Donut (just first 3 parts) |
| UV unwrapping | Blender official docs → UV Editing |
| Shape keys | YouTube: "Blender shape keys tutorial" (any recent one) |
| GLB export | Blender official glTF exporter docs |
| Shrinkwrap modifier | YouTube: "Blender shrinkwrap clothing" |

**Rule:** Watch for 20 minutes then try. Don't tutorial-chain.

---

## Daily Rhythm

1. Pull latest from `main`
2. Work on your Blender file (`.blend` file can be committed too)
3. When a GLB is ready → commit to `public/models/`
4. Message Krishang: "tshirt_v1.glb is in public/models — mesh name is Shirt, UV from front"
5. Watch Krishang's branch to understand how your assets are being used

---

## Psychological Note

Your work is invisible until Krishang loads it. That can feel frustrating.  
But remember: **Krishang cannot render anything until you give him something to render.**

You are the asset pipeline. The game can't ship without assets.

Ugly mannequin → browser → working = 100x more valuable than perfect mannequin sitting in a Blender file.

Ship early. Iterate.
