import { initFederation } from '@angular-architects/native-federation';

import { formatRuntimeConfigError, renderRuntimeConfigError } from './app/core/config/bootstrap-error';
import { FEDERATION_MANIFEST_PATH } from './app/core/federation/federation.models';

const APP_STARTUP_LOADING_ID = 'app-startup-loading';
const APP_STARTUP_LOADING_MIN_VISIBLE_MS = 220;
const APP_STARTUP_LOADING_FADE_MS = 280;
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
    }, fadeDurationMs);
  }, delayMs);
}

void initFederation(FEDERATION_MANIFEST_PATH)
  .then(() => import('./bootstrap'))
  .then(() => {
    hideStartupLoadingPage(document);
  })
  .catch((err) => {
  console.error(err);
  hideStartupLoadingPage(document);
  renderRuntimeConfigError(document, formatRuntimeConfigError(err));
});
