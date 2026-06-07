import { Injectable, Signal, computed, signal } from '@angular/core';

import {
  AppLoadingPhase,
  AppLoadingReason,
  AppLoadingShowOptions,
  AppLoadingState,
  DEFAULT_LOADING_FADE_OUT_MS,
  DEFAULT_LOADING_MINIMUM_VISIBLE_MS,
  INITIAL_APP_LOADING_STATE,
} from './app-loading.models';

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

@Injectable({ providedIn: 'root' })
export class AppLoadingService {
  private readonly stateSignal = signal<AppLoadingState>({
    ...INITIAL_APP_LOADING_STATE,
    reducedMotion: detectReducedMotion(),
  });
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  readonly state: Signal<AppLoadingState> = computed(() => this.stateSignal());
  readonly isVisible = computed(() => this.stateSignal().phase !== 'hidden');

  show(reason: AppLoadingReason, options: AppLoadingShowOptions = {}): void {
    this.clearTimers();

    const reducedMotion = detectReducedMotion();
    const minimumVisibleMs = options.minimumVisibleMs ?? DEFAULT_LOADING_MINIMUM_VISIBLE_MS;
    const fadeOutMs = reducedMotion ? 0 : (options.fadeOutMs ?? DEFAULT_LOADING_FADE_OUT_MS);

    this.stateSignal.set({
      ...this.stateSignal(),
      phase: 'active',
      reason,
      startedAtMs: Date.now(),
      minimumVisibleMs,
      fadeOutMs,
      reducedMotion,
    });
  }

  complete(reason?: AppLoadingReason): void {
    const current = this.stateSignal();
    if (current.phase !== 'active') {
      return;
    }

    if (reason !== undefined && current.reason !== reason) {
      return;
    }

    const elapsedMs = Date.now() - current.startedAtMs;
    const delayMs = Math.max(0, current.minimumVisibleMs - elapsedMs);

    this.hideTimer = setTimeout(() => {
      this.transitionToPhase('exiting');

      if (this.stateSignal().fadeOutMs === 0) {
        this.hideNow();
        return;
      }

      this.exitTimer = setTimeout(() => {
        this.hideNow();
      }, this.stateSignal().fadeOutMs);
    }, delayMs);
  }

  hideNow(): void {
    this.clearTimers();

    this.stateSignal.set({
      ...this.stateSignal(),
      phase: 'hidden',
    });
  }

  private transitionToPhase(phase: AppLoadingPhase): void {
    this.stateSignal.set({
      ...this.stateSignal(),
      phase,
    });
  }

  private clearTimers(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
    }
  }
}
