export const FEDERATION_MANIFEST_PATH = '/config/federation.manifest.json' as const;

export const FEDERATION_REMOTE_NAMES = ['mf1', 'mf2', 'ocpi-mfe'] as const;

export type FederationRemoteName = (typeof FEDERATION_REMOTE_NAMES)[number];

export type FederationManifest = Readonly<Record<FederationRemoteName, string>>;

export type RemoteComponentExportName = 'Mf1Component' | 'Mf2Component' | 'OcpiMfeComponent';

export interface RemoteComponentContract {
	readonly exposedModule: './Component';
}

export interface RemoteRouteContract extends RemoteComponentContract {
	readonly remoteName: FederationRemoteName;
	readonly routePath: `/${string}`;
	readonly displayName: string;
	readonly icon: string | null;
	readonly componentExportName: RemoteComponentExportName;
}