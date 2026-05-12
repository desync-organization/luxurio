# MirrorSim — Design Document
> App Architecture · Repo Structure · UI Design · Complete Tech Stack

---

## 1. Project Identity

| Field | Value |
|---|---|
| Codename | MirrorSim |
| Repo Name | `closet-engine` |
| Type | Browser-based 3D wardrobe simulator |
| Core Philosophy | Personal wardrobe visualization, not e-commerce |
| MVP Scope | Mannequin + one shirt + one body slider |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     BROWSER                         │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │   UI Layer   │    │      3D Render Layer      │   │
│  │              │    │                           │   │
│  │  Sliders     │───▶│  React Three Fiber        │   │
│  │  Wardrobe    │    │  ├── Avatar Mesh (GLB)    │   │
│  │  Panel       │    │  ├── Clothing Mesh (GLB)  │   │
│  │  Uploader    │    │  ├── Lighting Rig         │   │
│  │  Camera Ctrls│    │  └── OrbitControls        │   │
│  └──────────────┘    └──────────────────────────┘   │
│         │                        ▲                   │
│         ▼                        │                   │
│  ┌──────────────────────────────────────────────┐   │
│  │              State Layer                      │   │
│  │                                               │   │
│  │  avatarState: { height, waist, shoulders... } │   │
│  │  wardrobeState: { top, bottom, items[] }      │   │
│  │  sceneState: { camera, lighting }             │   │
│  └──────────────────────────────────────────────┘   │
│         │                                            │
│         ▼                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │           Texture Pipeline (client-side)      │   │
│  │                                               │   │
│  │  Upload → BG Removal → Texture → THREE.Tex   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

EXTERNAL TOOLS (Dev-time only, not runtime):
  Blender → GLB meshes → src/assets/models/
```

---

## 3. Repository Structure

```
closet-engine/
│
├── public/
│   └── favicon.ico
│
├── src/
│   │
│   ├── assets/
│   │   ├── models/
│   │   │   ├── mannequin.glb        ← base avatar mesh with morph targets
│   │   │   ├── tshirt.glb           ← T-shirt clothing mesh
│   │   │   ├── jeans.glb            ← jeans clothing mesh (Phase 5)
│   │   │   └── hoodie.glb           ← future
│   │   └── textures/
│   │       └── default_skin.png     ← fallback skin texture
│   │
│   ├── components/
│   │   ├── Avatar/
│   │   │   ├── AvatarMesh.tsx       ← loads mannequin.glb, applies morphs
│   │   │   └── AvatarMesh.module.css
│   │   ├── Clothing/
│   │   │   ├── ClothingMesh.tsx     ← loads clothing GLB, applies texture
│   │   │   └── ClothingMesh.module.css
│   │   └── Scene/
│   │       ├── Lighting.tsx         ← ambient + directional lights
│   │       ├── Ground.tsx           ← subtle floor plane
│   │       └── CameraRig.tsx        ← orbit controls config
│   │
│   ├── ui/
│   │   ├── BodySliders/
│   │   │   ├── BodySliders.tsx      ← slider panel component
│   │   │   └── BodySliders.module.css
│   │   ├── ClothingUploader/
│   │   │   ├── ClothingUploader.tsx ← file input + preview
│   │   │   └── ClothingUploader.module.css
│   │   ├── WardrobePanel/
│   │   │   ├── WardrobePanel.tsx    ← saved items grid (Phase 5)
│   │   │   └── WardrobePanel.module.css
│   │   └── CameraControls/
│   │       └── ViewPresets.tsx      ← front/side/3-4 buttons (Phase 6)
│   │
│   ├── scenes/
│   │   └── MainScene.tsx            ← composes full 3D scene
│   │
│   ├── models/
│   │   └── useAvatar.ts             ← avatar state + morph target logic
│   │
│   ├── store/
│   │   ├── avatarStore.ts           ← avatar slider state
│   │   └── wardrobeStore.ts         ← clothing items state (Phase 5)
│   │
│   ├── utils/
│   │   ├── textureExtractor.ts      ← image → THREE.Texture pipeline
│   │   ├── backgroundRemoval.ts     ← wrapper for @imgly/background-removal
│   │   └── morphTargets.ts          ← helpers for GLB morph target access
│   │
│   ├── App.tsx                      ← root layout: sidebar + canvas
│   ├── main.tsx                     ← Vite entry point
│   └── index.css                    ← global resets
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── plan.md
├── design.md
├── krishang.md
└── raj.md
```

---

## 4. Complete Tech Stack

### Core Runtime
| Package | Version | Purpose |
|---|---|---|
| `react` | ^18 | UI framework |
| `react-dom` | ^18 | DOM rendering |
| `typescript` | ^5 | Type safety (don't let it block you) |
| `vite` | ^5 | Dev server + build tool |

### 3D Rendering
| Package | Purpose |
|---|---|
| `three` | WebGL 3D engine |
| `@react-three/fiber` | React wrapper for Three.js |
| `@react-three/drei` | Helpers: OrbitControls, useGLTF, Environment, etc. |

### Texture / Image Pipeline
| Package | Purpose |
|---|---|
| `@imgly/background-removal` | Client-side WASM background removal, no API key |

### State Management
| Tool | When |
|---|---|
| React `useState` | Phase 1–3 (simple, local) |
| React `useContext` | Phase 3–4 (share across components) |
| `zustand` | Phase 5+ (if state gets complex) |

### Dev Tools
| Tool | Purpose |
|---|---|
| `leva` | Runtime 3D debug controls (sliders, color pickers) |
| React DevTools | Component inspection |
| Blender 3.x+ | Mesh creation, UV maps, morph targets, GLB export |

### Optional / Future
| Tool | When |
|---|---|
| `@react-three/postprocessing` | Visual effects (bloom, depth of field) — Phase 6 |
| `zustand` | Wardrobe state if it gets complex |
| Electron / Tauri | Desktop packaging — far future |
| `remove.bg` API | Cloud BG removal alternative |

---

## 5. Data Models

### AvatarState
```typescript
interface AvatarState {
  height: number;          // 0–1 morph influence
  waist: number;           // 0–1 morph influence
  shoulders: number;       // 0–1 morph influence
  chest: number;           // 0–1 morph influence
  skinTone: string;        // hex color for skin material
  // Phase 3 starts with just ONE of these
}
```

### ClothingItem
```typescript
interface ClothingItem {
  id: string;
  name: string;
  meshType: 'tshirt' | 'hoodie' | 'jeans' | 'cargo' | 'kurta';
  textureUrl: string;      // blob URL of extracted texture
  thumbnailUrl: string;    // blob URL of original upload
  uploadedAt: number;
}
```

### WardrobeState
```typescript
interface WardrobeState {
  items: ClothingItem[];
  activeTop: ClothingItem | null;
  activeBottom: ClothingItem | null;
}
```

---

## 6. Clothing Texture Pipeline (Detailed)

```
User uploads image (JPG/PNG of shirt laid flat or worn)
        │
        ▼
┌─────────────────────────────────┐
│  @imgly/background-removal      │
│  Runs in browser via WASM       │
│  Returns: PNG with alpha/transp │
└─────────────────────────────────┘
        │
        ▼
Create THREE.Texture from canvas/blob
        │
        ▼
Apply to clothing mesh material:
  new THREE.MeshStandardMaterial({
    map: extractedTexture,
    transparent: true,
    side: THREE.FrontSide
  })
        │
        ▼
Clothing mesh renders with user's shirt texture
```

**Key insight:** We don't reconstruct the 3D shape of the shirt. We only extract the flat texture (colors, patterns, logo) and stretch-map it onto a predefined shirt-shaped mesh. This is the entire trick.

---

## 7. Morph Target System (Detailed)

```
Blender:
  Mannequin base mesh
  + Shape Key: "waist_narrow" (mesh deformed to narrow waist)
  + Shape Key: "shoulders_wide" (mesh deformed to wide shoulders)
  + Shape Key: "height_tall" (stretch transform)
  Export → GLB (morph targets are embedded)

Browser (R3F):
  useGLTF('mannequin.glb')
  → nodes.Body.morphTargetDictionary  // { waist_narrow: 0, ... }
  → nodes.Body.morphTargetInfluences  // [0.0, 0.0, ...]

  Slider onChange:
  → nodes.Body.morphTargetInfluences[index] = sliderValue
  → Three.js re-renders the deformed mesh
```

---

## 8. UI Layout Design

```
┌──────────────────────────────────────────────────────────┐
│  MirrorSim                                    [☰ menu]   │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  BODY        │                                           │
│  ───────     │            3D VIEWPORT                    │
│  Height  ─── │                                           │
│  Waist   ─── │         [Mannequin renders here]          │
│  Shoulder─── │                                           │
│              │                                           │
│  CLOTHING    │                                           │
│  ───────     │                                           │
│  [Upload     │                                           │
│   Shirt  ]   │                                           │
│              │                                           │
│  [Upload     │                                           │
│   Pants  ]   ├───────────────────────────────────────────┤
│              │  [Front] [Side] [3/4]    [📷 Screenshot]  │
└──────────────┴───────────────────────────────────────────┘

Phase 1: Just the viewport (black canvas, cube)
Phase 2: Viewport + mannequin
Phase 3: Add left sidebar with one slider
Phase 4: Add clothing upload button
Phase 5: Add wardrobe panel (saved items grid)
```

---

## 9. Blender → Browser Asset Pipeline

```
Blender workflow:
  1. Create / import base mesh
  2. Set up UV maps (Window → UV Editor)
  3. Add Shape Keys (Properties → Object Data → Shape Keys)
  4. File → Export → glTF 2.0
     ✓ Include: Mesh, UVs, Normals, Shape Keys (Morph Targets)
     Format: GLB (binary, single file)
  5. Drop into: src/assets/models/

Browser loads:
  const { scene, nodes } = useGLTF('/models/mannequin.glb')
  // Access morph targets via nodes.MeshName.morphTargetInfluences
```

**Naming convention for GLB files:**
- `mannequin_v1.glb` — base body, no clothing
- `tshirt_v1.glb` — T-shirt mesh (fits over mannequin)
- `jeans_v1.glb` — jeans mesh

Version-suffix every export. Never overwrite.

---

## 10. MVP Boundaries (DO NOT CROSS)

### In Scope
- Single browser tab app
- Mannequin rendering
- Body morph sliders
- Clothing mesh with texture upload
- Basic wardrobe switching

### Out of Scope Forever (for now)
- ❌ Backend / server / database
- ❌ User authentication / accounts
- ❌ Cloud storage
- ❌ AI features (stylist, recommendations)
- ❌ Mobile / responsive design
- ❌ Multiple users / sharing
- ❌ Shopping integrations
- ❌ Payment / monetization
- ❌ Real-time collaboration
- ❌ Physics-based cloth simulation
