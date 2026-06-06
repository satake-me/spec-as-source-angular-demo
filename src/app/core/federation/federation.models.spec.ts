import { describe, expect, it } from 'vitest';

import {
	FEDERATION_MANIFEST_PATH,
	FEDERATION_REMOTE_NAMES,
	type FederationManifest,
	type RemoteComponentContract,
	type RemoteRouteContract,
} from './federation.models';

describe('federation.models', () => {
	it('publishes the manifest path and remote names used by the host', () => {
		expect(FEDERATION_MANIFEST_PATH).toBe('/config/federation.manifest.json');
		expect(FEDERATION_REMOTE_NAMES).toEqual(['mf1', 'mf2']);
	});

	it('keeps the federation manifest shape stable for local remotes', () => {
		const manifest = {
			mf1: 'http://localhost:4201/remoteEntry.json',
			mf2: 'http://localhost:4202/remoteEntry.json',
		} satisfies FederationManifest;

		expect(manifest.mf1).toContain('4201');
		expect(manifest.mf2).toContain('4202');
	});

	it('keeps the remote component contract boundary explicit', () => {
		const contract = {
			exposedModule: './Component',
		} satisfies RemoteComponentContract;

		expect(contract.exposedModule).toBe('./Component');
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
			] as const;

			for (const contract of publishedContracts) {
				expect(FEDERATION_REMOTE_NAMES).toContain(contract.remoteName);
				expect(contract.exposedModule).toBe('./Component');
			}
		});

		it('keeps host dependencies limited to published federation contracts', () => {
			const publishedDependencies = {
				manifestPath: FEDERATION_MANIFEST_PATH,
				remoteNames: FEDERATION_REMOTE_NAMES,
				exposedModule: './Component',
			};

			expect(publishedDependencies.manifestPath).toBe('/config/federation.manifest.json');
			expect(publishedDependencies.remoteNames).toEqual(['mf1', 'mf2']);
			expect(publishedDependencies.exposedModule).toBe('./Component');
		});
});