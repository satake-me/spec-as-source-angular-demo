import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

import { WorldClockPageComponent } from './features/world-clock/world-clock-page.component';
import { AccountPageComponent } from './features/account/account-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { RemoteUnavailablePageComponent } from './features/remote-unavailable/remote-unavailable-page.component';
import { WelcomePageComponent } from './features/welcome/welcome-page.component';
import { canActivateAuthenticatedRoute } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';

function loadRemoteRoutes(remoteName: string): Promise<Routes> {
	return loadRemoteModule(remoteName, './Routes').then(
		(module) => module.routes as Routes
	).catch((error) => {
		console.error(`Remote route tree for \"${remoteName}\" is not running at the moment.`, error);
		return [{ path: '', component: RemoteUnavailablePageComponent }];
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
				path: 'ocpi',
				loadChildren: () => loadRemoteRoutes('ocpi-mfe'),
				canActivate: [canActivateAuthenticatedRoute],
				data: { title: 'OCPI Modules', icon: 'hub' },
			},
			{
				path: 'payments',
				loadChildren: () => loadRemoteRoutes('payments-mfe'),
				canActivate: [canActivateAuthenticatedRoute],
				data: { title: 'Gateway Payments', icon: 'payments' },
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
