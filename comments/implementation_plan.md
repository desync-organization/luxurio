# Luxurio — Implementation Plan

> Migrating from Vite → Next.js + TypeScript + Tailwind + shadcn/ui + Radix UI + Magic UI

---

## Context

The existing repo is a React + Vite + TypeScript scaffold (Phase 0 complete). We're pivoting to **Next.js** as the framework, adding **Tailwind CSS**, **shadcn/ui** (Radix UI-based), and **Magic UI** for components. The `comments/` folder with Plan.md, Design.md, Tasks.md, and Krishang.md will be preserved.

## Color Palette (Strict)
- **Background/Dark**: `#0c0c0c`
- **Foreground/Light**: `#f5f5f0` (slightly off-white)

No other colors enter the palette at this stage.

---

## Task 1: Setup Next.js Environment (5–10 commits)

1. **chore: remove vite scaffold files** — Delete old Vite-specific files (vite.config.ts, index.html, src/, tsconfig.app.json, tsconfig.node.json, eslint.config.js, package.json, package-lock.json)
2. **feat: initialize next.js project with typescript** — `npx create-next-app@latest` with TS, Tailwind, App Router
3. **chore: configure tailwind with project color palette** — Set up `#0c0c0c` and off-white as the only theme colors
4. **feat: install and configure shadcn/ui** — `npx shadcn@latest init` with dark theme
5. **feat: install magic-ui package** — Add magic-ui components
6. **chore: configure project structure and aliases** — Set up path aliases, folder structure per Design.md
7. **chore: update gitignore and clean up config** — Ensure .next, node_modules, etc. are ignored

## Task 2: Initialize Browser Environment (5–10 commits)

1. **feat: create root layout with dark theme** — Set up RootLayout with Inter font, dark bg
2. **feat: create main page skeleton** — Basic page.tsx with viewport area
3. **feat: add global css reset and base styles** — CSS reset, body styles with palette
4. **chore: add metadata and seo configuration** — Title, description, favicon
5. **feat: verify dev server and hot reload** — Ensure `npm run dev` works

## Task 3: Make Placeholder UI (5–10 commits)

1. **feat: create app shell layout with sidebar** — Split layout: sidebar + main viewport
2. **feat: add sidebar component with upload section** — Placeholder sidebar with sections
3. **feat: add viewport placeholder area** — Dark canvas placeholder for 3D (future)
4. **feat: add header with project branding** — Minimal top bar with "Luxurio"
5. **feat: add placeholder status indicators** — Show current app state
6. **style: polish layout spacing and typography** — Fine-tune the minimal UI

## Task 4: Implement Image Upload Function (5–10 commits)

1. **feat: create image upload component with drag-drop** — shadcn-based file input + drag/drop zone
2. **feat: add file validation for images** — Accept only image/*, validate size
3. **feat: create image preview component** — Display uploaded image with thumbnail
4. **feat: wire upload state management** — React state for uploaded file + preview URL
5. **feat: add upload feedback with loading states** — Visual feedback during upload
6. **feat: integrate upload into sidebar panel** — Connect uploader to the sidebar layout

## Task 5: Implement Remove Background Function (5–10 commits)

1. **feat: install imgly background-removal package** — `npm install @imgly/background-removal`
2. **feat: create background removal utility** — `lib/background-removal.ts` wrapper
3. **feat: add processing state and progress indicator** — Show WASM model download + processing
4. **feat: display before/after comparison** — Show original vs bg-removed result
5. **feat: create texture extraction utility** — Convert blob to usable texture data
6. **feat: wire bg removal into upload pipeline** — Auto-trigger after upload
7. **feat: add error handling and retry logic** — Handle WASM failures gracefully

---

## Commit Strategy
- Each task gets **5–10 commits** as specified
- Commit messages follow conventional commits: `feat:`, `chore:`, `style:`, `fix:`, `docs:`
- Each commit is atomic and the app should remain functional after each commit
