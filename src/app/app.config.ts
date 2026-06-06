import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { KeycloakRuntimeSettings } from './core/config/runtime-config.models';
import { provideAppKeycloak } from './core/keycloak/keycloak.config';
import { NativeFederationRemoteRouteResolver } from './layout/native-federation-remote-route.resolver';
import { SHELL_REMOTE_ROUTE_RESOLVER } from './layout/shell-remote-loader';

export function createAppConfig(runtimeSettings: KeycloakRuntimeSettings): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideHttpClient(),
      provideRouter(routes),
      provideAppKeycloak(runtimeSettings),
      {
        provide: SHELL_REMOTE_ROUTE_RESOLVER,
        useExisting: NativeFederationRemoteRouteResolver,
      },
    ],
  };
}
