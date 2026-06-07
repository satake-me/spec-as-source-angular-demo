# Contract: Loading Overlay Service

## Purpose

Define the typed control surface for showing and dismissing the global loading overlay in the Angular application.

## Service Interface

```ts
type LoadingReason = 'app-startup' | 'route-transition' | 'manual';
type LoadingPhase = 'hidden' | 'active' | 'exiting';

interface LoadingOverlayState {
  phase: LoadingPhase;
  reason: LoadingReason;
  startedAtMs: number;
  minimumVisibleMs: number;
  fadeOutMs: number;
  reducedMotion: boolean;
}

interface ShowOverlayOptions {
  minimumVisibleMs?: number;
  fadeOutMs?: number;
}

interface LoadingOverlayServiceContract {
  readonly state: Signal<LoadingOverlayState>;
  show(reason: LoadingReason, options?: ShowOverlayOptions): void;
  complete(reason?: LoadingReason): void;
  hideNow(): void;
}
```

## Behavioral Rules

- `show(...)` MUST transition state to `active` when hidden.
- `complete(...)` MUST transition `active -> exiting -> hidden` respecting `minimumVisibleMs` and `fadeOutMs`.
- `hideNow()` MUST transition to `hidden` immediately and clear pending timers.
- Service MUST be safe for repeated calls and race conditions during bootstrap.

## Accessibility Expectations

- Service state MUST expose whether reduced-motion behavior is active.
- Reduced-motion mode MAY set `fadeOutMs` to `0` while preserving visibility semantics.
