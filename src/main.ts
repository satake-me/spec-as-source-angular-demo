import { initFederation } from '@angular-architects/native-federation';

import { formatRuntimeConfigError, renderRuntimeConfigError } from './app/core/config/bootstrap-error';
import { FEDERATION_MANIFEST_PATH } from './app/core/federation/federation.models';

void initFederation(FEDERATION_MANIFEST_PATH)
  .then(() => import('./bootstrap'))
  .catch((err) => {
  console.error(err);
  renderRuntimeConfigError(document, formatRuntimeConfigError(err));
});
