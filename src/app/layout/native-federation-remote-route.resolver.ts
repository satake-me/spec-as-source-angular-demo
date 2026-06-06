import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@softarc/native-federation-runtime';
import { Routes } from '@angular/router';

import { RemoteDefinition } from './shell-remote.models';
import { ShellRemoteRouteResolver } from './shell-remote-loader';

@Injectable({ providedIn: 'root' })
export class NativeFederationRemoteRouteResolver implements ShellRemoteRouteResolver {
  async loadRoutes(remote: RemoteDefinition): Promise<Routes> {
    const loadedModule = (await loadRemoteModule({
      remoteEntry: remote.remoteEntry,
      exposedModule: remote.exposedModule,
    } as never)) as Record<string, unknown>;

    const remoteRoutes = loadedModule['remoteRoutes'];
    if (Array.isArray(remoteRoutes)) {
      return remoteRoutes as Routes;
    }

    const routes = loadedModule['routes'];
    if (Array.isArray(routes)) {
      return routes as Routes;
    }

    throw new Error(`Remote '${remote.id}' did not expose route definitions.`);
  }
}
