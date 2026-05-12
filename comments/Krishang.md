# krishang.md — Your Work
> React Three Fiber · Texture Pipeline · UI Layer · State

---

## Your Role

You own the **browser side** of Luxurio.  
Raj makes the 3D assets. You make those assets come alive in the browser.  
You are the rendering engine operator, UI builder, and texture pipeline engineer.

Think of yourself as the **game engine programmer** — you don't make the 3D models, but you make them render, animate, respond to inputs, and look right on screen.

---

## Phase 1 Tasks — The Scene
*Goal: Cube renders in browser with orbit controls*

### 1.1 — Install R3F + Drei
```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

### 1.2 — Basic Scene Setup
Create `src/scenes/MainScene.tsx`:
- Wrap everything in `<Canvas>` (this is your WebGL context)
- Add `<OrbitControls />` from Drei
- Add `<ambientLight />` and `<directionalLight />`
- Add a `<mesh>` with `<boxGeometry>` and `<meshStandardMaterial>`

```tsx
// MainScene.tsx skeleton
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export function MainScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 2]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}
```

### 1.3 — Wire into App.tsx
Make `<MainScene />` render in `App.tsx`. The Canvas needs explicit height:
```css
/* App.css or inline */
canvas { width: 100vw; height: 100vh; }
```

### 1.4 — Commit
```
feat: render cube in browser with R3F and orbit controls
```

**Checkpoint:** Pink cube visible. Mouse drag rotates it. ✓

---

## Phase 2 Tasks — The Mannequin
*Goal: Load Raj's GLB mannequin into the scene*

### 2.1 — GLB Loading
When Raj hands you `mannequin.glb`, drop it into `public/models/` (or `src/assets/models/` — use `public/` for simplicity first).

Create `src/components/Avatar/AvatarMesh.tsx`:
```tsx
import { useGLTF } from '@react-three/drei'

export function AvatarMesh() {
  const { scene } = useGLTF('/models/mannequin.glb')
  return <primitive object={scene} />
}
```

### 2.2 — Scene Tuning
- Adjust `camera.position` so mannequin fills the viewport nicely
- Tune `ambientLight` and `directionalLight` intensities
- Optionally add `<Environment preset="studio" />` from Drei for better lighting

### 2.3 — Ground Plane (optional)
```tsx
// subtle reflective floor
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
  <planeGeometry args={[10, 10]} />
  <meshStandardMaterial color="#111" />
</mesh>
```

### 2.4 — Commit
```
feat: load mannequin GLB into R3F scene
```

**Checkpoint:** Mannequin stands in scene. Camera orbits it. ✓

---

## Phase 3 Tasks — The Slider
*Goal: One slider morphs the avatar's body shape*

### 3.1 — Understand Morph Targets
When Raj exports the mannequin with shape keys, they become **morph targets** in the GLB.

Access them like this:
```tsx
const { nodes } = useGLTF('/models/mannequin.glb')
// nodes.Body is the mesh
// nodes.Body.morphTargetDictionary = { waist_narrow: 0, ... }
// nodes.Body.morphTargetInfluences = [0.0, ...]
```

### 3.2 — Avatar State
Create `src/store/avatarStore.ts`:
```typescript
import { useState } from 'react'

// Start simple — just a React state hook wrapper
// No Zustand yet
export interface AvatarState {
  waist: number;  // 0 to 1
}
```

Or just use `useState` in `App.tsx` and pass as prop. Don't over-engineer this.

### 3.3 — Wire Slider → Morph
In `AvatarMesh.tsx`, accept a prop:
```tsx
interface Props {
  waist: number; // 0–1
}

export function AvatarMesh({ waist }: Props) {
  const { nodes } = useGLTF('/models/mannequin.glb')
  
  useEffect(() => {
    const mesh = nodes.Body // name depends on Raj's Blender naming
    if (mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = waist
    }
  }, [waist, nodes])

  return <primitive object={nodes.Body} />
}
```

### 3.4 — Build the Slider UI
Create `src/ui/BodySliders/BodySliders.tsx`:
```tsx
interface Props {
  waist: number;
  onChange: (val: number) => void;
}

export function BodySliders({ waist, onChange }: Props) {
  return (
    <div className="sliders-panel">
      <label>Waist</label>
      <input
        type="range"
        min={0} max={1} step={0.01}
        value={waist}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}
```

### 3.5 — Commit
```
feat: waist slider morphs avatar mesh in real-time
```

**Checkpoint:** Drag slider → mannequin waist visibly changes shape. ✓

---

## Phase 4 Tasks — The Shirt (Texture Pipeline)
*Goal: Upload a shirt photo → texture appears on mannequin's shirt mesh*

### 4.1 — Install Background Removal
```bash
npm install @imgly/background-removal
```

### 4.2 — Background Removal Utility
Create `src/utils/backgroundRemoval.ts`:
```typescript
import { removeBackground } from '@imgly/background-removal'

export async function removeClothingBackground(file: File): Promise<Blob> {
  const blob = await removeBackground(file)
  return blob // PNG with transparent background
}
```
Note: First run downloads WASM models (~20MB). This is normal. It's all client-side.

### 4.3 — Texture Extraction
Create `src/utils/textureExtractor.ts`:
```typescript
import * as THREE from 'three'

export function blobToThreeTexture(blob: Blob): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      resolve(texture)
    })
  })
}
```

### 4.4 — Clothing Uploader UI
Create `src/ui/ClothingUploader/ClothingUploader.tsx`:
```tsx
export function ClothingUploader({ onTextureReady }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    const blob = await removeClothingBackground(file)
    const texture = await blobToThreeTexture(blob)
    onTextureReady(texture)
  }

  return (
    <div>
      <label>Upload Shirt</label>
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  )
}
```

### 4.5 — Clothing Mesh Component
Create `src/components/Clothing/ClothingMesh.tsx`:
```tsx
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  texture: THREE.Texture | null;
}

export function ClothingMesh({ texture }: Props) {
  const { nodes } = useGLTF('/models/tshirt.glb')
  
  useEffect(() => {
    if (texture && nodes.Shirt) {
      nodes.Shirt.material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      })
    }
  }, [texture, nodes])

  return texture ? <primitive object={nodes.Shirt} /> : null
}
```

### 4.6 — Commit
```
feat: shirt texture upload pipeline — bg removal and UV mapping
```

**Checkpoint:** Upload a shirt photo → shirt texture appears on mannequin. ✓

---

## Phase 5 Tasks — Wardrobe
*Goal: Multiple clothing items, click to switch*

### 5.1 — Wardrobe State
Create `src/store/wardrobeStore.ts` using Zustand (install it: `npm install zustand`):
```typescript
import { create } from 'zustand'

interface ClothingItem {
  id: string;
  name: string;
  texture: THREE.Texture;
  thumbnailUrl: string;
  meshType: 'tshirt' | 'jeans';
}

interface WardrobeStore {
  items: ClothingItem[];
  activeTop: ClothingItem | null;
  activeBottom: ClothingItem | null;
  addItem: (item: ClothingItem) => void;
  setActiveTop: (item: ClothingItem) => void;
  setActiveBottom: (item: ClothingItem) => void;
}
```

### 5.2 — Wardrobe Panel UI
Create `src/ui/WardrobePanel/WardrobePanel.tsx`:
- Grid of uploaded clothing thumbnails
- Click item → sets as active top or bottom
- Visual indicator for currently active items

### 5.3 — Commit
```
feat: wardrobe panel with multi-item switching
```

---

## Phase 6 Tasks — Polish

- Camera preset buttons (front / side / 3-4 view)
- Screenshot button: `gl.domElement.toDataURL('image/png')`
- Basic CSS polish — dark theme, clean sidebar
- Leva debug panel (optional, good for development)

---

## Your Learning Path (Problem-Driven)

Only learn what the current phase requires:

| Phase | Learn |
|---|---|
| 1 | R3F Canvas, mesh, lights, OrbitControls |
| 2 | useGLTF, primitive, positioning |
| 3 | morphTargetInfluences, useEffect with 3D |
| 4 | File APIs, THREE.TextureLoader, blob URLs |
| 5 | Zustand basics, component composition |
| 6 | canvas.toDataURL, CSS layout |

**Resources:**
- https://docs.pmnd.rs/react-three-fiber — official R3F docs (read this)
- https://drei.pmnd.rs — every Drei component (bookmark this)
- https://threejs.org/examples — see what's possible

---

## Communication with Raj

Tell Raj what you need, precisely:

| What you need | How to ask |
|---|---|
| Mannequin GLB | "Send me mannequin.glb — I'll drop it in public/models/" |
| Shape key name | "What did you name the waist shape key in Blender?" |
| Shirt mesh name | "What's the mesh object name inside tshirt.glb?" |
| UV layout info | "Is the shirt UV front-facing, 0-1 range?" |

The mesh **object names** inside the GLB are critical — they determine `nodes.BodyName` in your code. Always confirm naming with Raj before writing component code.

---

## Useful Debug Tricks

```tsx
// Log everything inside a GLB:
const gltf = useGLTF('/models/mannequin.glb')
console.log(gltf) // shows scene, nodes, materials, animations

// See morph targets:
console.log(nodes.Body.morphTargetDictionary)
// { waist_narrow: 0, shoulder_wide: 1, ... }
```

---

## Daily Rhythm

1. Pull latest from `main`
2. Create branch: `git checkout -b feat/phase-X-description`
3. Build one thing until it works
4. Commit with descriptive message
5. Push + open PR
6. Tell Raj what you merged so he can update assets if needed
