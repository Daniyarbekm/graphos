# Graphos

Modern mathematical graph visualization — inspired by Desmos.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + CSS variables theme
- **Zustand** — client state
- **math.js** — expression parsing & sampling (foundation)
- **React Three Fiber** + **Three.js** — 3D render pipeline (placeholder)
- **Framer Motion** — UI animations
- **shadcn/ui** — component primitives

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run typecheck` | `tsc --noEmit` |

## Architecture

Feature-Sliced / Clean Architecture hybrid:

```
src/
├── app/              # Next.js routes, layout, global styles
├── shared/           # Cross-cutting types & config
├── entities/         # Domain models (expression, graph)
├── features/         # User actions (expression list, theme, mode)
├── widgets/          # Composite UI blocks (sidebar, toolbar, shell)
├── components/       # Reusable UI (shadcn, glass panels)
├── hooks/            # Shared React hooks
├── lib/              # Utilities, constants
├── store/            # Zustand stores
├── math-engine/      # Parse, compile, sample (no rendering)
└── render-engine/    # Canvas / R3F (no math logic)
```

### Layer Rules

| Layer | May import from |
|-------|-----------------|
| `app` | widgets, features, components |
| `widgets` | features, entities, components, store |
| `features` | entities, components, store, hooks |
| `entities` | shared only |
| `math-engine` | shared only |
| `render-engine` | math-engine types, shared, store |

**Never** import `render-engine` into `math-engine`, or UI into either engine.

## Implemented

- **Math engine (ЭТАП 4)** — modular Desmos-style parser → [docs/ETAP-4.md](docs/ETAP-4.md)
- **2D** — cartesian + parametric curves, implicit multiplication, full trig/functions
- **3D** — surfaces `z = f(x,y)` with realtime updates
- **2D canvas** — grid, axes, curves, pan/zoom
- **3D scene** — R3F + Drei, orbit controls, surface meshes
- **Mode switch** — animated 2D ↔ 3D with loading state

## ЭТАП 4 — Math Engine

| Layer | Path |
|-------|------|
| Preprocess | `math-engine/preprocess/` |
| Tokenizer | `math-engine/tokenizer/` |
| Parser | `math-engine/parser/` |
| Evaluator | `math-engine/evaluator/` |
| Graph generators | `math-engine/graph/` |

## Where to Extend

| Concern | Location |
|---------|----------|
| New functions / syntax | `preprocess/shorthand.ts`, `core/constants.ts` |
| Polar / implicit | `parser/equation.ts`, `graph/` |
| 3D camera presets | `render-engine/scene/camera-controller.tsx` |

## Theme

Dark/light via `next-themes`. Tokens in `src/app/globals.css` (`:root` / `.dark`).

## License

Private — scaffold for development.
