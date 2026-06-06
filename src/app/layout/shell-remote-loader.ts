import { Injectable, InjectionToken, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RemoteDefinition, RemoteFailureReason, RemoteId } from './shell-remote.models';
import { ShellRemoteRegistryLoader } from './shell-remote-registry.loader';
import { RemoteUnavailableComponent } from './remote-unavailable.component';

export interface ShellRemoteRouteResolver {
  loadRoutes(remote: RemoteDefinition): Promise<Routes>;
}

class DefaultShellRemoteRouteResolver implements ShellRemoteRouteResolver {
  async loadRoutes(_remote: RemoteDefinition): Promise<Routes> {
    throw new Error('Remote route resolver is not configured for this environment.');
  }
}

export const SHELL_REMOTE_ROUTE_RESOLVER = new InjectionToken<ShellRemoteRouteResolver>(
  'SHELL_REMOTE_ROUTE_RESOLVER',
  {
    providedIn: 'root',
    factory: () => new DefaultShellRemoteRouteResolver(),
  }
);

@Injectable({ providedIn: 'root' })
export class ShellRemoteLoader {
  private readonly registryLoader = inject(ShellRemoteRegistryLoader);
  private readonly resolver = inject(SHELL_REMOTE_ROUTE_RESOLVER);

  async loadRemoteRoutes(remoteId: RemoteId): Promise<Routes> {
    const registryResult = await firstValueFrom(this.registryLoader.loadRegistry());

    if (registryResult.status === 'error') {
      return this.buildUnavailableRoute(remoteId, 'manifest');
    }

    const remote = registryResult.remotes.find((entry) => entry.id === remoteId);
    if (!remote) {
      return this.buildUnavailableRoute(remoteId, 'manifest');
    }

    try {
      const routes = await this.resolver.loadRoutes(remote);
      if (!Array.isArray(routes) || routes.length === 0) {
        return this.buildUnavailableRoute(remoteId, 'exposed-module');
      }

      return routes;
    } catch {
      return this.buildUnavailableRoute(remoteId, 'entry');
    }
  }

  private buildUnavailableRoute(remoteId: RemoteId, failureReason: RemoteFailureReason): Routes {
    return [
      {
        path: '',
        component: RemoteUnavailableComponent,
        data: {
          remoteId,
          failureReason,
        },
      },
    ];
  }
}
