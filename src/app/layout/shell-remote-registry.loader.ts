import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, Observable, shareReplay } from 'rxjs';

import {
  createRemoteRegistryFallback,
  normalizeRemoteRegistryConfig,
  RemoteRegistryLoadResult,
} from './shell-remote.models';

export const RUNTIME_REMOTE_REGISTRY_CONFIG_PATH = '/config/remotes.json';

@Injectable({ providedIn: 'root' })
export class ShellRemoteRegistryLoader {
  private readonly httpClient = inject(HttpClient);

  private readonly remoteRegistry$ = this.httpClient.get<unknown>(RUNTIME_REMOTE_REGISTRY_CONFIG_PATH).pipe(
    map((payload) => {
      const remotes = normalizeRemoteRegistryConfig(payload);
      return {
        status: 'ready',
        remotes,
        errorMessage: null,
      } as RemoteRegistryLoadResult;
    }),
    catchError((error: unknown) => {
      const errorMessage =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : 'Unable to load remote registry configuration.';

      return of({
        status: 'error',
        remotes: createRemoteRegistryFallback(),
        errorMessage,
      } as RemoteRegistryLoadResult);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  loadRegistry(): Observable<RemoteRegistryLoadResult> {
    return this.remoteRegistry$;
  }
}
