import { Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

import { WorldClockPageComponent } from './features/world-clock/world-clock-page.component';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { RemoteUnavailablePageComponent } from './features/remote-unavailable/remote-unavailable-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';

function loadRemoteComponent(remoteName: string, exportName: string): Promise<Type<unknown>> {
	return loadRemoteModule(remoteName, './Component').then(
		(module) => module[exportName] as Type<unknown>
	).catch((error) => {
		console.error(`Remote application \"${remoteName}\" is not running at the moment.`, error);
		return RemoteUnavailablePageComponent;
	});
}

export const routes: Routes = [
	{
		path: '',
		component: AppShellComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: WelcomePageComponent,
			},
			{
				path: 'home',
				component: HomePageComponent,
				canActivate: [canActivateAuthenticatedRoute],
			},
			{
				path: 'account',
				component: AccountPageComponent,
				canActivate: [canActivateAuthenticatedRoute],
			},
			{
				path: 'world-clock',
				component: WorldClockPageComponent,
				data: { title: 'World Clock', icon: 'schedule' },
			},
			{
				path: 'mf1',
				loadComponent: () => loadRemoteComponent('mf1', 'Mf1Component'),
				data: { title: 'Catalogo Federado', icon: 'storefront' },
			},
			{
				path: 'mf2',
				loadComponent: () => loadRemoteComponent('mf2', 'Mf2Component'),
				data: { title: 'Dashboard Operacional', icon: 'dashboard' },
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
