import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { RUNTIME_REMOTE_REGISTRY_CONFIG_PATH, ShellRemoteRegistryLoader } from './shell-remote-registry.loader';

describe('ShellRemoteRegistryLoader', () => {
  let loader: ShellRemoteRegistryLoader;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    loader = TestBed.inject(ShellRemoteRegistryLoader);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads and normalizes a valid remote registry payload', async () => {
    const resultPromise = firstValueFrom(loader.loadRegistry());

    const request = httpTestingController.expectOne(RUNTIME_REMOTE_REGISTRY_CONFIG_PATH);
    expect(request.request.method).toBe('GET');

    request.flush({
      version: '1',
      remotes: [
        {
          id: 'ocpi',
          routePath: 'ocpi',
          displayName: 'OCPI',
          remoteEntry: 'http://localhost:4301/remoteEntry.json',
          exposedModule: './routes',
          requiredPermissions: ['OCPI_VIEW'],
        },
        {
          id: 'gateways',
          routePath: 'gateways',
          displayName: 'Gateways',
          remoteEntry: 'http://localhost:4302/remoteEntry.json',
          exposedModule: './routes',
          requiredPermissions: ['GATEWAYS_VIEW'],
        },
      ],
    });

    const result = await resultPromise;
    expect(result.status).toBe('ready');
    expect(result.remotes).toHaveLength(2);
    expect(result.errorMessage).toBeNull();
  });

  it('returns an error result when registry has duplicate route paths', async () => {
    const resultPromise = firstValueFrom(loader.loadRegistry());

    const request = httpTestingController.expectOne(RUNTIME_REMOTE_REGISTRY_CONFIG_PATH);
    request.flush({
      version: '1',
      remotes: [
        {
          id: 'ocpi',
          routePath: 'ocpi',
          displayName: 'OCPI',
          remoteEntry: 'http://localhost:4301/remoteEntry.json',
          exposedModule: './routes',
          requiredPermissions: [],
        },
        {
          id: 'gateways',
          routePath: 'ocpi',
          displayName: 'Gateways',
          remoteEntry: 'http://localhost:4302/remoteEntry.json',
          exposedModule: './routes',
          requiredPermissions: [],
        },
      ],
    });

    const result = await resultPromise;
    expect(result.status).toBe('error');
    expect(result.remotes).toEqual([]);
    expect(result.errorMessage).toContain("Duplicate remote routePath 'ocpi'.");
  });

  it('returns fallback result when http request fails', async () => {
    const resultPromise = firstValueFrom(loader.loadRegistry());

    const request = httpTestingController.expectOne(RUNTIME_REMOTE_REGISTRY_CONFIG_PATH);
    request.flush('failed', { status: 500, statusText: 'Server Error' });

    const result = await resultPromise;
    expect(result.status).toBe('error');
    expect(result.remotes).toEqual([]);
    expect(result.errorMessage).toBe('Unable to load remote registry configuration.');
  });
});
