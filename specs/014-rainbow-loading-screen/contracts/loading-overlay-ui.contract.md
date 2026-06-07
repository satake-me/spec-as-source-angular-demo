# Contract: Loading Overlay UI Composition

## Purpose

Define required UI regions and hierarchy for the loading overlay presentation.

## Required Regions

- **Foreground Loader Region**
  - Centered in viewport.
  - Rainbow gradient animated loader.
  - Optional loading text for status context.

- **Background Skeleton Region**
  - Left sidebar placeholder block.
  - Top navigation bar placeholder block.
  - Main content placeholder blocks.
  - Neutral tone palette with blur and translucency.

## Required Hierarchy

1. Overlay backdrop and skeleton layer.
2. Centered rainbow loader layer.
3. Optional status copy.

Loader layer MUST be visually dominant over skeleton layer.

## Visual Behavior Contract

- Overlay MUST occupy full viewport and remain above all app content while active.
- Overlay MUST block pointer interaction with app content while active.
- Overlay MUST support fade-out transition on completion.
- Reduced-motion mode MUST preserve visual hierarchy while minimizing continuous animation.

## Responsive Contract

- Desktop and mobile breakpoints MUST keep loader fully visible and centered.
- Skeleton blocks MUST remain recognizable as sidebar/topbar/content structures.

## Failure/Recovery Contract

- If startup fails and error UI is rendered, overlay MUST not remain permanently active.
- Overlay cleanup MUST be idempotent (safe if called multiple times).
