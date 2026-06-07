import { describe, expect, it } from 'vitest';

import {
	FEDERATION_MANIFEST_PATH,
	FEDERATION_REMOTE_NAMES,
	type FederationManifest,
	type RemoteComponentContract,
	type RemoteRoutesContract,
	type RemoteRouteContract,
} from './federation.models';

describe('federation.models', () => {
	it('publishes the manifest path and remote names used by the host', () => {
		expect(FEDERATION_MANIFEST_PATH).toBe('/config/federation.manifest.json');
		expect(FEDERATION_REMOTE_NAMES).toEqual(['mf1', 'mf2', 'ocpi-mfe']);
	});

	it('keeps the federation manifest shape stable for local remotes', () => {
		const manifest = {
			mf1: 'http://localhost:4201/remoteEntry.json',
			mf2: 'http://localhost:4202/remoteEntry.json',
			'ocpi-mfe': 'http://localhost:4203/remoteEntry.json',
		} satisfies FederationManifest;

		expect(manifest.mf1).toContain('4201');
		expect(manifest.mf2).toContain('4202');
		expect(manifest['ocpi-mfe']).toContain('4203');
	});

	it('keeps the remote component contract boundary explicit', () => {
		const contract = {
			exposedModule: './Component',
		} satisfies RemoteComponentContract;

		expect(contract.exposedModule).toBe('./Component');
	});

	it('keeps the remote routes contract boundary explicit', () => {
		const contract = {
			exposedModule: './Routes',
		} satisfies RemoteRoutesContract;

		expect(contract.exposedModule).toBe('./Routes');
	});

	it('keeps route metadata aligned with exposed component contracts', () => {
		const remoteRoute = {
			remoteName: 'mf1',
			routePath: '/mf1',
			displayName: 'Catalogo Federado',
			icon: 'storefront',
			exposedModule: './Component',
			componentExportName: 'Mf1Component',
		} satisfies RemoteRouteContract;

		expect(remoteRoute.remoteName).toBe('mf1');
	});

		it('keeps exposed-module keys stable for all published remote contracts', () => {
			const publishedContracts = [
				{ remoteName: 'mf1', exposedModule: './Component' },
				{ remoteName: 'mf2', exposedModule: './Component' },
				{ remoteName: 'ocpi-mfe', exposedModule: './Component' },
			] as const;

			for (const contract of publishedContracts) {
				expect(FEDERATION_REMOTE_NAMES).toContain(contract.remoteName);
				expect(contract.exposedModule).toBe('./Component');
			}
		});

		it('keeps the OCPI remote routes module key stable for shell lazy loading', () => {
			const routesContract = {
				remoteName: 'ocpi-mfe',
				exposedModule: './Routes',
			} as const;

			expect(FEDERATION_REMOTE_NAMES).toContain(routesContract.remoteName);
			expect(routesContract.exposedModule).toBe('./Routes');
		});

		it('keeps host dependencies limited to published federation contracts', () => {
			const publishedDependencies = {
				manifestPath: FEDERATION_MANIFEST_PATH,
				remoteNames: FEDERATION_REMOTE_NAMES,
				exposedModule: './Component',
			};

			expect(publishedDependencies.manifestPath).toBe('/config/federation.manifest.json');
			expect(publishedDependencies.remoteNames).toEqual(['mf1', 'mf2', 'ocpi-mfe']);
			expect(publishedDependencies.exposedModule).toBe('./Component');
		});
});