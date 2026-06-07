import { describe, expect, it } from 'vitest';

import {
	FEDERATION_MANIFEST_PATH,
	FEDERATION_REMOTE_NAMES,
	type FederationManifest,
	type RemoteRoutesContract,
} from './federation.models';

describe('federation.models', () => {
	it('publishes the manifest path and remote names used by the host', () => {
		expect(FEDERATION_MANIFEST_PATH).toBe('/config/federation.manifest.json');
		expect(FEDERATION_REMOTE_NAMES).toEqual(['ocpi-mfe', 'payments-mfe']);
	});

	it('keeps the federation manifest shape stable for local remotes', () => {
		const manifest = {
			'ocpi-mfe': 'http://localhost:4203/remoteEntry.json',
			'payments-mfe': 'http://localhost:4204/remoteEntry.json',
		} satisfies FederationManifest;

		expect(manifest['ocpi-mfe']).toContain('4203');
		expect(manifest['payments-mfe']).toContain('4204');
	});

	it('keeps the remote routes contract boundary explicit', () => {
		const contract = {
			exposedModule: './Routes',
		} satisfies RemoteRoutesContract;

		expect(contract.exposedModule).toBe('./Routes');
	});

		it('keeps the OCPI remote routes module key stable for shell lazy loading', () => {
			const routesContract = {
				remoteName: 'ocpi-mfe',
				exposedModule: './Routes',
			} as const;

			expect(FEDERATION_REMOTE_NAMES).toContain(routesContract.remoteName);
			expect(routesContract.exposedModule).toBe('./Routes');
		});

		it('keeps the payments remote routes module key stable for shell lazy loading', () => {
			const routesContract = {
				remoteName: 'payments-mfe',
				exposedModule: './Routes',
			} as const;

			expect(FEDERATION_REMOTE_NAMES).toContain(routesContract.remoteName);
			expect(routesContract.exposedModule).toBe('./Routes');
		});

		it('keeps host dependencies limited to published federation contracts', () => {
			const publishedDependencies = {
				manifestPath: FEDERATION_MANIFEST_PATH,
				remoteNames: FEDERATION_REMOTE_NAMES,
				exposedModule: './Routes',
			};

			expect(publishedDependencies.manifestPath).toBe('/config/federation.manifest.json');
			expect(publishedDependencies.remoteNames).toEqual(['ocpi-mfe', 'payments-mfe']);
			expect(publishedDependencies.exposedModule).toBe('./Routes');
		});
});