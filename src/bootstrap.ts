import { bootstrapApplication } from '@angular/platform-browser';

import { createAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { loadRuntimeConfig } from './app/core/config/runtime-config.loader';

async function bootstrapApp(): Promise<void> {
  const runtimeSettings = await loadRuntimeConfig();

  await bootstrapApplication(AppComponent, createAppConfig(runtimeSettings));
}

void bootstrapApp();
