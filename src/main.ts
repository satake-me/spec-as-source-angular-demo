import { initFederation } from '@angular-architects/native-federation';

import { formatRuntimeConfigError, renderRuntimeConfigError } from './app/core/config/bootstrap-error';
import { FEDERATION_MANIFEST_PATH } from './app/core/federation/federation.models';

const APP_STARTUP_LOADING_ID = 'app-startup-loading';
const APP_STARTUP_LOADING_MIN_VISIBLE_MS = 900;
const APP_STARTUP_LOADING_FADE_MS = 420;
const APP_LOADING_OVERLAY_READY_EVENT = 'app-loading-overlay-ready';
const APP_LOADING_OVERLAY_READY_TIMEOUT_MS = 2500;
const APP_STARTUP_LOADING_HIDDEN_EVENT = 'app-startup-loading-hidden';
const STARTED_AT_MS = Date.now();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hideStartupLoadingPage(targetDocument: Document): void {
  const startupLoadingNode = targetDocument.getElementById(APP_STARTUP_LOADING_ID);
  if (!startupLoadingNode) {
    return;
  }

  const elapsedMs = Date.now() - STARTED_AT_MS;
  const delayMs = Math.max(0, APP_STARTUP_LOADING_MIN_VISIBLE_MS - elapsedMs);
  const fadeDurationMs = prefersReducedMotion() ? 0 : APP_STARTUP_LOADING_FADE_MS;

  setTimeout(() => {
    startupLoadingNode.style.setProperty('--startup-loading-fade-ms', `${fadeDurationMs}`);
    startupLoadingNode.classList.add('app-startup-loading--exit');

    setTimeout(() => {
      startupLoadingNode.remove();
      targetDocument.documentElement.dataset['startupLoadingHidden'] = 'true';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(APP_STARTUP_LOADING_HIDDEN_EVENT));
      }
    }, fadeDurationMs);
  }, delayMs);
}

function waitForAngularLoadingOverlayReady(targetWindow: Window): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;

    const finish = (): void => {
      if (resolved) {
        return;
      }

      resolved = true;
      clearTimeout(timeoutId);
      targetWindow.removeEventListener(APP_LOADING_OVERLAY_READY_EVENT, onOverlayReady);
      resolve();
    };

    const onOverlayReady = (): void => {
      finish();
    };

    const timeoutId = setTimeout(() => {
      finish();
    }, APP_LOADING_OVERLAY_READY_TIMEOUT_MS);

    targetWindow.addEventListener(APP_LOADING_OVERLAY_READY_EVENT, onOverlayReady, { once: true });
  });
}

function waitForNextPaint(targetWindow: Window): Promise<void> {
  return new Promise((resolve) => {
    targetWindow.requestAnimationFrame(() => {
      targetWindow.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

const overlayReadyPromise =
  typeof window === 'undefined' ? Promise.resolve() : waitForAngularLoadingOverlayReady(window);

void initFederation(FEDERATION_MANIFEST_PATH)
  .then(() => import('./bootstrap'))
  .then(async () => {
    await overlayReadyPromise;
    if (typeof window !== 'undefined') {
      await waitForNextPaint(window);
    }
    hideStartupLoadingPage(document);
  })
  .catch((err) => {
  console.error(err);
  hideStartupLoadingPage(document);
  renderRuntimeConfigError(document, formatRuntimeConfigError(err));
});
