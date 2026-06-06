import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { routes } from './app.routes';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { AppShellComponent } from './layout/app-shell.component';
import { SHELL_REMOTE_ROUTE_RESOLVER, ShellRemoteLoader } from './layout/shell-remote-loader';
import { ShellRemoteRegistryLoader } from './layout/shell-remote-registry.loader';

describe('app routes', () => {
  const loadRegistry = vi.fn();
  const loadRoutes = vi.fn();

  beforeEach(() => {
    loadRegistry.mockReset();
    loadRoutes.mockReset();

    TestBed.configureTestingModule({
      providers: [
        ShellRemoteLoader,
        {
          provide: ShellRemoteRegistryLoader,
          useValue: {
            loadRegistry,
          },
        },
        {
          provide: SHELL_REMOTE_ROUTE_RESOLVER,
          useValue: {
            loadRoutes,
          },
        },
      ],
    });
  });

  it('uses the shell component as the root route', () => {
    expect(routes[0]).toMatchObject({
      path: '',
      component: AppShellComponent,
    });
  });

  it('uses the welcome page as the shell child entry route', () => {
    expect(routes[0]?.children?.[0]).toMatchObject({
      path: '',
      pathMatch: 'full',
      component: WelcomePageComponent,
    });
  });

  it('protects the shell home child route and maps it to the home page component', () => {
    expect(routes[0]?.children?.[1]).toMatchObject({
      path: 'home',
      component: HomePageComponent,
    });
    expect(routes[0]?.children?.[1]?.canActivate?.length).toBe(1);
    expect(routes[0]?.children?.[1]?.canActivate?.[0]).toBe(canActivateAuthenticatedRoute);
  });

  it('protects the shell account child route and maps it to the account page component', () => {
    expect(routes[0]?.children?.[2]).toMatchObject({
      path: 'account',
      component: AccountPageComponent,
    });
    expect(routes[0]?.children?.[2]?.canActivate?.length).toBe(1);
  });

  it('registers protected federated OCPI and Gateways routes', () => {
    expect(routes[0]?.children?.[4]).toMatchObject({
      path: 'ocpi',
      data: { title: 'OCPI', icon: 'ev_station' },
    });
    expect(routes[0]?.children?.[5]).toMatchObject({
      path: 'gateways',
      data: { title: 'Gateways', icon: 'hub' },
    });
  });

  it('loads federated child routes when registry and resolver succeed', async () => {
    loadRegistry.mockReturnValue(
      of({
        status: 'ready',
        remotes: [
          {
            id: 'ocpi',
            routePath: 'ocpi',
            displayName: 'OCPI',
            remoteEntry: 'http://localhost:4301/remoteEntry.json',
            exposedModule: './routes',
            requiredPermissions: ['OCPI_VIEW'],
          },
        ],
        errorMessage: null,
      })
    );
    const remoteRoutes: Routes = [{ path: '', component: HomePageComponent }];
    loadRoutes.mockResolvedValue(remoteRoutes);

    const route = routes[0]?.children?.find((child) => child.path === 'ocpi');
    const loaded = await TestBed.runInInjectionContext(async () => route?.loadChildren?.());

    expect(loaded).toEqual(remoteRoutes);
  });

  it('returns unavailable fallback route when registry fails', async () => {
    loadRegistry.mockReturnValue(
      of({
        status: 'error',
        remotes: [],
        errorMessage: 'Registry unavailable',
      })
    );

    const route = routes[0]?.children?.find((child) => child.path === 'gateways');
    const loaded = (await TestBed.runInInjectionContext(async () => route?.loadChildren?.())) as Routes;

    expect(loaded[0]?.path).toBe('');
    expect(loaded[0]?.data?.['remoteId']).toBe('gateways');
    expect(loaded[0]?.data?.['failureReason']).toBe('manifest');
  });

  it('keeps route loading continuity when navigating across OCPI and Gateways remotes', async () => {
    loadRegistry.mockReturnValue(
      of({
        status: 'ready',
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
        errorMessage: null,
      })
    );

    loadRoutes.mockImplementation(async (remote) => [{ path: '', data: { remoteId: remote.id } }]);

    const ocpiRoute = routes[0]?.children?.find((child) => child.path === 'ocpi');
    const gatewaysRoute = routes[0]?.children?.find((child) => child.path === 'gateways');

    const ocpiLoaded = (await TestBed.runInInjectionContext(async () => ocpiRoute?.loadChildren?.())) as Routes;
    const gatewaysLoaded = (await TestBed.runInInjectionContext(async () => gatewaysRoute?.loadChildren?.())) as Routes;

    expect(ocpiLoaded[0]?.data?.['remoteId']).toBe('ocpi');
    expect(gatewaysLoaded[0]?.data?.['remoteId']).toBe('gateways');
  });
});