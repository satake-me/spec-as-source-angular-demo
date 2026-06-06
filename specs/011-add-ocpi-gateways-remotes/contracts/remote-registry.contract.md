# Contract: Shell Remote Registry

## Purpose

Define the typed contract that the Angular shell uses to discover and consume runtime remotes for OCPI and Gateways.

## Contract shape

```ts
interface RemoteDefinition {
  readonly id: 'ocpi' | 'gateways';
  readonly routePath: 'ocpi' | 'gateways';
  readonly displayName: string;
  readonly remoteEntry: string;
  readonly exposedModule: './routes';
  readonly requiredPermissions: ReadonlyArray<string>;
}

type RemoteRegistry = ReadonlyArray<RemoteDefinition>;
```

## Required entries

- Registry MUST include one entry for `ocpi`.
- Registry MUST include one entry for `gateways`.
- `routePath` values MUST be unique.

## Behavior contract

- Shell route config resolves remote route loading by `id` and `exposedModule`.
- Shell menu projection uses `displayName`, `routePath`, and `requiredPermissions`.
- Remote endpoint (`remoteEntry`) is environment-configurable and must not be hardcoded in route components.

## Failure contract

When a registry entry is missing or malformed for a requested route:
- Shell must render standardized unavailable-module state.
- Shell must preserve global layout and allow navigation to other routes.

## Compatibility notes

- Changes to `id`, `routePath`, or `exposedModule` are breaking and require coordinated shell+remote release.
- Additional optional metadata can be added without breaking consumers if typed as optional.
