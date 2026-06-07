import '@angular/compiler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@angular-architects/native-federation', () => ({
  loadRemoteModule: vi.fn(),
}));

import { loadRemoteModule } from '@angular-architects/native-federation';

import { routes } from './app.routes';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { RemoteUnavailablePageComponent } from './features/remote-unavailable/remote-unavailable-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { AppShellComponent } from './layout/app-shell.component';

const loadRemoteModuleMock = vi.mocked(loadRemoteModule);

function getShellChildren() {
  return routes[0]?.children ?? [];
}

function findShellRoute(path: string) {
  return getShellChildren().find((route) => route.path === path);
}

describe('app routes', () => {
  beforeEach(() => {
    loadRemoteModuleMock.mockReset();
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
    const accountRoute = findShellRoute('account');

    expect(accountRoute).toMatchObject({
      path: 'account',
      component: AccountPageComponent,
    });
    expect(accountRoute?.canActivate?.length).toBe(1);
  });

  it('adds an OCPI placeholder route in the shell tree', () => {
    const ocpiRoute = findShellRoute('ocpi');

    expect(ocpiRoute).toMatchObject({
      path: 'ocpi',
      data: { title: 'OCPI Modules', icon: 'hub' },
    });
    expect(ocpiRoute?.loadChildren).toEqual(expect.any(Function));
  });

  it('adds a Gateway Payments placeholder route in the shell tree', () => {
    const paymentsRoute = findShellRoute('payments');

    expect(paymentsRoute).toMatchObject({
      path: 'payments',
      data: { title: 'Gateway Payments', icon: 'payments' },
    });
    expect(paymentsRoute?.loadChildren).toEqual(expect.any(Function));
  });

  it('protects the OCPI route using the authenticated route guard', () => {
    const ocpiRoute = findShellRoute('ocpi');

    expect(ocpiRoute?.canActivate?.length).toBe(1);
    expect(ocpiRoute?.canActivate?.[0]).toBe(canActivateAuthenticatedRoute);
  });

  it('protects the Gateway Payments route using the authenticated route guard', () => {
    const paymentsRoute = findShellRoute('payments');

    expect(paymentsRoute?.canActivate?.length).toBe(1);
    expect(paymentsRoute?.canActivate?.[0]).toBe(canActivateAuthenticatedRoute);
  });

  it('resolves ocpi-mfe using the stable exposed route contract', async () => {
    const remoteRoutes = [{ path: '', title: 'OCPI Modules' }];

    loadRemoteModuleMock.mockResolvedValue({ routes: remoteRoutes });
    const routeChildren = await findShellRoute('ocpi')?.loadChildren?.();

    expect(routeChildren).toBe(remoteRoutes);
    expect(loadRemoteModuleMock).toHaveBeenCalledWith('ocpi-mfe', './Routes');
  });

  it('resolves payments-mfe using the stable exposed route contract', async () => {
    const remoteRoutes = [{ path: '', title: 'Gateway Payments' }];

    loadRemoteModuleMock.mockResolvedValue({ routes: remoteRoutes });
    const routeChildren = await findShellRoute('payments')?.loadChildren?.();

    expect(routeChildren).toBe(remoteRoutes);
    expect(loadRemoteModuleMock).toHaveBeenCalledWith('payments-mfe', './Routes');
  });

  it('shows a friendly fallback page when the OCPI route tree is unavailable', async () => {
    loadRemoteModuleMock.mockRejectedValue(new Error('Remote is offline'));

    const routeChildren = await findShellRoute('ocpi')?.loadChildren?.();

    expect(routeChildren).toEqual([{ path: '', component: RemoteUnavailablePageComponent }]);
  });

  it('shows a friendly fallback page when the payments route tree is unavailable', async () => {
    loadRemoteModuleMock.mockRejectedValue(new Error('Remote is offline'));

    const routeChildren = await findShellRoute('payments')?.loadChildren?.();

    expect(routeChildren).toEqual([{ path: '', component: RemoteUnavailablePageComponent }]);
  });

  it('keeps route definitions free from hardcoded remote entry URLs', () => {
    const routeTree = JSON.stringify(routes);

    expect(routeTree).not.toContain('remoteEntry.json');
    expect(routeTree).not.toContain('http://localhost:4203');
    expect(routeTree).not.toContain('http://localhost:4204');
  });
});