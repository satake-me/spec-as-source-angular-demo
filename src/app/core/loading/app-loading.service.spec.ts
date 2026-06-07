import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLoadingService } from './app-loading.service';

describe('AppLoadingService', () => {
  let service: AppLoadingService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new AppLoadingService();
  });

  it('transitions hidden to active when show is called', () => {
    service.show('app-startup');

    expect(service.state().phase).toBe('active');
    expect(service.state().reason).toBe('app-startup');
    expect(service.isVisible()).toBe(true);
  });

  it('transitions active to exiting and then hidden when complete is called', () => {
    service.show('app-startup', { minimumVisibleMs: 100, fadeOutMs: 300 });

    service.complete('app-startup');
    vi.advanceTimersByTime(100);

    expect(service.state().phase).toBe('exiting');

    vi.advanceTimersByTime(300);

    expect(service.state().phase).toBe('hidden');
    expect(service.isVisible()).toBe(false);
  });

  it('does not complete if reason does not match current state reason', () => {
    service.show('app-startup', { minimumVisibleMs: 50, fadeOutMs: 50 });

    service.complete('manual');
    vi.advanceTimersByTime(200);

    expect(service.state().phase).toBe('active');
  });

  it('hides immediately when hideNow is called', () => {
    service.show('manual');

    service.hideNow();

    expect(service.state().phase).toBe('hidden');
    expect(service.isVisible()).toBe(false);
  });

  it('respects reduced-motion by disabling fade duration', () => {
    const originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    service.show('app-startup', { minimumVisibleMs: 10, fadeOutMs: 250 });

    expect(service.state().reducedMotion).toBe(true);
    expect(service.state().fadeOutMs).toBe(0);

    service.complete('app-startup');
    vi.advanceTimersByTime(10);

    expect(service.state().phase).toBe('hidden');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
