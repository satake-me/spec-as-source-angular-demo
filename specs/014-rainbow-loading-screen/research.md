# Research: Rainbow Loading Overlay

## Decision 1: Extend the existing bootstrap loading shell in `src/index.html`

- **Decision**: Keep the startup loading element (`#app-startup-loading`) in `src/index.html` as the root overlay surface and evolve its visual structure to include a centered rainbow loader and blurred skeleton background.
- **Rationale**: The host already displays a pre-bootstrap loader from static HTML and removes it from `main.ts`; extending this path avoids introducing extra render timing risk and keeps startup behavior predictable.
- **Alternatives considered**: Rendering the first loading screen from an Angular component after bootstrap. This delays first paint and can expose blank or partially initialized UI.

## Decision 2: Introduce an Angular loading service and loading overlay component for in-app control

- **Decision**: Add a feature-local loading service in the Angular app that exposes typed loading state and is consumed by a dedicated loading overlay component mounted near the app shell.
- **Rationale**: User request requires service-driven control and overlay reuse after bootstrap; a typed service contract keeps state transitions explicit and testable.
- **Alternatives considered**: Driving in-app loading purely via route flags or direct component-local state. This fragments behavior and makes global control difficult.

## Decision 3: Keep overlay always above content with fixed positioning and layered composition

- **Decision**: Use a fixed, viewport-sized overlay layer with explicit z-index and pointer-event capture while active; compose neutral skeleton background and centered loader in separate visual layers.
- **Rationale**: This guarantees dominance over existing shell/content and prevents accidental interaction during loading.
- **Alternatives considered**: Absolute positioning inside page containers. This can break when parent stacking/overflow contexts change.

## Decision 4: Use CSS gradients and transform-based animation for fluid rainbow motion

- **Decision**: Implement the loader with CSS gradient-based color progression and transform animation tuned for smooth rotation/flow.
- **Rationale**: CSS transform/opacity animation is performant, simple to maintain, and sufficient for the required vibrant, fluid effect.
- **Alternatives considered**: Canvas or SVG animation runtimes. They add complexity and are unnecessary for this visual requirement.

## Decision 5: Fade out via state transition with minimum display floor

- **Decision**: Keep active/loading/exiting/hidden states in service-driven overlay state and apply a short fade-out transition when startup completes, with a minimum visible interval to avoid flash.
- **Rationale**: Prevents abrupt removal and visual jitter on fast startup paths while preserving responsiveness.
- **Alternatives considered**: Immediate removal when app is ready. This can cause visible popping and perceived instability.

## Decision 6: Respect reduced-motion preferences for accessibility

- **Decision**: Detect and apply reduced-motion behavior via CSS media query and typed state flags, replacing continuous animation with low-motion/static variants while preserving hierarchy.
- **Rationale**: Meets accessibility expectations and keeps loading clarity for motion-sensitive users.
- **Alternatives considered**: Slowing but keeping all animations. This still creates persistent motion and may not satisfy accessibility intent.

## Decision 7: Validate behavior at component plus end-to-end levels

- **Decision**: Cover service state transitions and overlay rendering in Angular tests, and validate startup/integration behavior through Playwright scenarios.
- **Rationale**: This aligns with constitution guidance to test at the lowest effective level while protecting critical user journeys.
- **Alternatives considered**: E2E-only validation. Slower and less precise for diagnosing regressions in state transitions and visual gating.
