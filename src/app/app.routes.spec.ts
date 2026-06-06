import '@angular/compiler';
import { Type } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@angular-architects/native-federation', () => ({
  loadRemoteModule: vi.fn(),
}));

import { loadRemoteModule } from '@angular-architects/native-federation';

import { routes } from './app.routes';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { AppShellComponent } from './layout/app-shell.component';

const loadRemoteModuleMock = vi.mocked(loadRemoteModule);

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
    expect(routes[0]?.children?.[2]).toMatchObject({
      path: 'account',
      component: AccountPageComponent,
    });
    expect(routes[0]?.children?.[2]?.canActivate?.length).toBe(1);
  });

  it('lazily loads the mf1 remote from the shell route tree', () => {
    expect(routes[0]?.children?.[4]).toMatchObject({
      path: 'mf1',
      data: { title: 'Catalogo Federado', icon: 'storefront' },
    });
    expect(routes[0]?.children?.[4]?.loadComponent).toEqual(expect.any(Function));
  });

  it('lazily loads the mf2 remote from the shell route tree', () => {
    expect(routes[0]?.children?.[5]).toMatchObject({
      path: 'mf2',
      data: { title: 'Dashboard Operacional', icon: 'dashboard' },
    });
    expect(routes[0]?.children?.[5]?.loadComponent).toEqual(expect.any(Function));
  });

  it('resolves mf1 using the manifest remote name and stable exposed module key', async () => {
    class Mf1Component {}

    loadRemoteModuleMock.mockResolvedValue({ Mf1Component });
    const component = await routes[0]?.children?.[4]?.loadComponent?.();

    expect(component).toBe(Mf1Component as unknown as Type<unknown>);
    expect(loadRemoteModuleMock).toHaveBeenCalledWith('mf1', './Component');
  });

  it('resolves mf2 using the manifest remote name and stable exposed module key', async () => {
    class Mf2Component {}

    loadRemoteModuleMock.mockResolvedValue({ Mf2Component });
    const component = await routes[0]?.children?.[5]?.loadComponent?.();

    expect(component).toBe(Mf2Component as unknown as Type<unknown>);
    expect(loadRemoteModuleMock).toHaveBeenCalledWith('mf2', './Component');
  });

  it('keeps route definitions free from hardcoded remote entry URLs', () => {
    const routeTree = JSON.stringify(routes);

    expect(routeTree).not.toContain('remoteEntry.json');
    expect(routeTree).not.toContain('http://localhost:4201');
    expect(routeTree).not.toContain('http://localhost:4202');
  });
});