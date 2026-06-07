import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLoadingService } from '../core/loading/app-loading.service';
import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
  let loadingService: AppLoadingService;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent],
      providers: [AppLoadingService],
    }).compileComponents();

    loadingService = TestBed.inject(AppLoadingService);
  });

  it('renders overlay and rainbow loader when active', () => {
    loadingService.show('app-startup');

    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-testid="loading-overlay"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="loading-rainbow-loader"]')).not.toBeNull();
  });

  it('applies exiting class when service transitions to exiting', () => {
    loadingService.show('app-startup', { minimumVisibleMs: 10, fadeOutMs: 80 });

    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.detectChanges();

    loadingService.complete('app-startup');
    vi.advanceTimersByTime(10);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-testid="loading-overlay"]');
    expect(overlay?.classList.contains('loading-overlay--exiting')).toBe(true);
  });

  it('renders skeleton regions while overlay is visible', () => {
    loadingService.show('app-startup');

    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="loading-skeleton-sidebar"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="loading-skeleton-topbar"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="loading-skeleton-content"]')).not.toBeNull();
  });

  it('applies reduced motion class when reduced motion is active', () => {
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

    loadingService.show('app-startup');

    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-testid="loading-overlay"]');
    expect(overlay?.classList.contains('loading-overlay--reduced-motion')).toBe(true);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
