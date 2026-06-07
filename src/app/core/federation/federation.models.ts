export const FEDERATION_MANIFEST_PATH = '/config/federation.manifest.json' as const;

export const FEDERATION_REMOTE_NAMES = ['ocpi-mfe', 'payments-mfe'] as const;

export type FederationRemoteName = (typeof FEDERATION_REMOTE_NAMES)[number];

export type FederationManifest = Readonly<Record<FederationRemoteName, string>>;

export interface RemoteRoutesContract {
	readonly exposedModule: './Routes';
}