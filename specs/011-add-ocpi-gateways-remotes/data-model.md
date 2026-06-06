# Data Model: Remote Microfrontend Integration (OCPI and Gateways)

## Overview

The shell consumes two independently deployed Angular remotes through a typed runtime registry and route exposure contracts.

## Entities

### RemoteDefinition

Represents one remote frontend integration entry configured by the shell.

Fields:
- `id: 'ocpi' | 'gateways'` unique remote identifier.
- `routePath: string` top-level shell route segment (`ocpi`, `gateways`).
- `displayName: string` menu label.
- `remoteEntry: string` environment-specific federation entry URL.
- `exposedModule: './routes'` exposed contract key.
- `requiredPermissions: ReadonlyArray<string>` permissions required for visibility/navigation.
- `healthcheckUrl: string | null` optional endpoint for operational checks.

Validation rules:
- `routePath` must be unique across all remotes.
- `remoteEntry` must be non-empty absolute URL in deployed environments.
- `requiredPermissions` may be empty only when route is intentionally public.

### RemoteMenuEntry

Represents menu projection for a remote destination.

Fields:
- `id: string` stable menu identifier.
- `label: string` user-facing label.
- `route: string` app-relative route (`/ocpi`, `/gateways`).
- `visible: boolean` computed from auth/permission context.
- `order: number` menu ordering.

Validation rules:
- `label` and `route` are required.
- `route` must match one registered shell top-level route.

### RemoteLoadState

Represents shell runtime status when resolving/loading a remote.

Fields:
- `remoteId: 'ocpi' | 'gateways'`
- `status: 'idle' | 'loading' | 'ready' | 'unavailable'`
- `failureReason: 'manifest' | 'entry' | 'exposed-module' | 'permission' | null`
- `updatedAt: string` ISO timestamp

State transitions:
1. `idle -> loading` when navigation targets a remote route.
2. `loading -> ready` when federation resolution and route load succeed.
3. `loading -> unavailable` on runtime load failure.
4. `unavailable -> loading` when user retries navigation.

### RemoteRouteContract

Represents exposed routing contract from a remote repository.

Fields:
- `exposedModule: './routes'`
- `exportName: 'remoteRoutes'`
- `routes: ReadonlyArray<RouteDefinition>`

Validation rules:
- Root remote route must include default path for initial page.
- Route definitions must be Angular-router-compatible and free of shell-internal dependencies.

## Relationships

- A `RemoteDefinition` maps 1:1 to a `RemoteMenuEntry` and a shell top-level route.
- A `RemoteDefinition` produces many `RemoteLoadState` events over time.
- A `RemoteRouteContract` is provided by each remote repository and consumed by shell runtime loader.

## Derived invariants

- If `RemoteMenuEntry.visible` is false, shell must block manual route access with existing authorization behavior.
- Shell navigation remains available regardless of individual `RemoteLoadState` failures.
- OCPI and Gateways remote integrations are independent; one remote failure cannot mark the other unavailable.
