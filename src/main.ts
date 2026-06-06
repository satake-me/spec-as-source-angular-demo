import { initFederation } from '@angular-architects/native-federation';

import { formatRuntimeConfigError, renderRuntimeConfigError } from './app/core/config/bootstrap-error';
import { FEDERATION_MANIFEST_PATH } from './app/core/federation/federation.models';

const APP_STARTUP_LOADING_ID = 'app-startup-loading';

function hideStartupLoadingPage(targetDocument: Document): void {
  targetDocument.getElementById(APP_STARTUP_LOADING_ID)?.remove();
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
