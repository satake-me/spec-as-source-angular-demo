# Data Model: Rainbow Loading Overlay

## Entities

### LoadingOverlayState

- **Purpose**: Canonical runtime state for global loading overlay visibility and transitions.
- **Fields**:
  - `phase`: `'hidden' | 'active' | 'exiting'`
  - `reason`: `'app-startup' | 'route-transition' | 'manual'`
  - `startedAtMs`: number
  - `minimumVisibleMs`: number
  - `fadeOutMs`: number
  - `reducedMotion`: boolean
- **Rules**:
  - `active` blocks interaction with underlying content.
  - Transition `active -> exiting` occurs only when load completion signal is received.
  - Transition `exiting -> hidden` occurs after fade duration, or immediately when reduced motion requires no transition.

### RainbowLoaderVisual

- **Purpose**: Visual contract for the centered loader treatment.
- **Fields**:
  - `size`: responsive token (`sm | md | lg`)
  - `gradientStops`: ordered spectrum colors
  - `animationDurationMs`: number
  - `animationMode`: `'continuous' | 'reduced'`
  - `centered`: boolean
- **Rules**:
  - Loader remains centered across viewport breakpoints.
  - Gradient progression must preserve rainbow order.
  - Reduced mode minimizes continuous motion while retaining loading affordance.

### SkeletonLayoutLayer

- **Purpose**: Placeholder layout shown behind loader to communicate app structure.
- **Fields**:
  - `sidebarBlock`: block geometry token
  - `topbarBlock`: block geometry token
  - `contentBlocks`: array of geometry tokens
  - `blurPx`: number
  - `opacity`: number
  - `neutralPalette`: color token set
- **Rules**:
  - Must visibly suggest left sidebar + top bar + main content regions.
  - Must remain visually subordinate to loader via blur/opacity/neutral tones.
  - Must scale responsively without clipping loader.

### LoadingOverlayControlCommand

- **Purpose**: Typed command boundary for service consumers.
- **Fields**:
  - `command`: `'show' | 'complete' | 'hideNow'`
  - `reason`: `'app-startup' | 'route-transition' | 'manual'`
  - `options`: `{ minimumVisibleMs?: number; fadeOutMs?: number }`
- **Rules**:
  - `show` when already active refreshes reason/options without duplicating layers.
  - `complete` from inactive state is a no-op.
  - `hideNow` bypasses exit transition for hard-reset cases.

## Relationships

- One `LoadingOverlayState` drives one active `RainbowLoaderVisual` presentation profile.
- One `LoadingOverlayState` controls one `SkeletonLayoutLayer` visibility profile.
- `LoadingOverlayControlCommand` mutates `LoadingOverlayState` through the loading service.

## State Transitions

1. **Hidden -> Active**: `show` command issued (startup or feature-triggered loading).
2. **Active -> Exiting**: `complete` command received and minimum display threshold satisfied.
3. **Exiting -> Hidden**: fade-out duration elapsed (or immediate in reduced-motion override).
4. **Any -> Hidden**: `hideNow` command for emergency cleanup.
