import { Routes } from '@angular/router';
import { WorldClockPageComponent } from './features/world-clock/world-clock-page.component';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';
import { ShellRemoteLoader } from './layout/shell-remote-loader';
import { RemoteId } from './layout/shell-remote.models';
import { inject } from '@angular/core';

function loadRemoteChildren(remoteId: RemoteId) {
	return () => inject(ShellRemoteLoader).loadRemoteRoutes(remoteId);
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
				path: 'ocpi',
				canActivate: [canActivateAuthenticatedRoute],
				loadChildren: loadRemoteChildren('ocpi'),
				data: { title: 'OCPI', icon: 'ev_station' },
			},
			{
				path: 'gateways',
				canActivate: [canActivateAuthenticatedRoute],
				loadChildren: loadRemoteChildren('gateways'),
				data: { title: 'Gateways', icon: 'hub' },
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
