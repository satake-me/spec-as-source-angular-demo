export type RemoteId = 'ocpi' | 'gateways';

export type RemoteLoadStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

export type RemoteFailureReason = 'manifest' | 'entry' | 'exposed-module' | 'permission' | null;

export interface RemoteDefinition {
  id: RemoteId;
  routePath: RemoteId;
  displayName: string;
  remoteEntry: string;
  exposedModule: './routes';
  requiredPermissions: string[];
}

export interface RemoteRegistryConfig {
  version: string;
  remotes: RemoteDefinition[];
}

export interface RemoteRegistryLoadResult {
  status: 'ready' | 'error';
  remotes: RemoteDefinition[];
  errorMessage: string | null;
}

export interface RemoteLoadState {
  remoteId: RemoteId;
  status: RemoteLoadStatus;
  failureReason: RemoteFailureReason;
  updatedAt: string;
}

export function normalizeRemoteRegistryConfig(payload: unknown): RemoteDefinition[] {
  if (!isRecord(payload)) {
    throw new Error('Remote registry payload must be a JSON object.');
  }

  const version = payload['version'];
  if (typeof version !== 'string' || version.trim().length === 0) {
    throw new Error('Remote registry version must be a non-empty string.');
  }

  const rawRemotes = payload['remotes'];
  if (!Array.isArray(rawRemotes)) {
    throw new Error('Remote registry remotes must be an array.');
  }

  const ids = new Set<string>();
  const paths = new Set<string>();

  return rawRemotes.map((remote, index) => {
    if (!isRecord(remote)) {
      throw new Error(`Remote entry at index ${index} must be an object.`);
    }

    const id = readRemoteId(remote['id']);
    const routePath = readRemoteId(remote['routePath']);
    const remoteEntry = readNonEmptyString(remote['remoteEntry'], 'remoteEntry');
    const exposedModule = readExposedModule(remote['exposedModule']);
    const displayName = readNonEmptyString(remote['displayName'], 'displayName');
    const requiredPermissions = readStringArray(remote['requiredPermissions'], 'requiredPermissions');

    if (ids.has(id)) {
      throw new Error(`Duplicate remote id '${id}'.`);
    }

    if (paths.has(routePath)) {
      throw new Error(`Duplicate remote routePath '${routePath}'.`);
    }

    ids.add(id);
    paths.add(routePath);

    return {
      id,
      routePath,
      displayName,
      remoteEntry,
      exposedModule,
      requiredPermissions,
    } satisfies RemoteDefinition;
  });
}

export function createRemoteRegistryFallback(): RemoteDefinition[] {
  return [];
}

function readRemoteId(value: unknown): RemoteId {
  if (value === 'ocpi' || value === 'gateways') {
    return value;
  }

  throw new Error("Remote id and routePath must be 'ocpi' or 'gateways'.");
}

function readExposedModule(value: unknown): './routes' {
  if (value === './routes') {
    return value;
  }

  throw new Error("Remote exposedModule must be './routes'.");
}

function readNonEmptyString(value: unknown, key: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} must be a non-empty string.`);
  }

  return value;
}

function readStringArray(value: unknown, key: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`);
  }

  for (const item of value) {
    if (typeof item !== 'string') {
      throw new Error(`${key} must contain only strings.`);
    }
  }

  return [...value];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
