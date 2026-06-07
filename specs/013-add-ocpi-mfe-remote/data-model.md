# Data Model: OCPI MFE Remote Integration

## Entities

### FederationManifest

- **Purpose**: Runtime map of remote names to remote entry URLs consumed by host.
- **Fields**:
  - `ocpi-mfe`: new OCPI remote entry URL (`http://localhost:4203/remoteEntry.json` in development).
  - `payments-mfe`: existing payments remote entry URL (`http://localhost:4204/remoteEntry.json` in development).
- **Rules**:
  - Keys are stable remote identifiers used by route loader.
  - Values must be reachable remote entry endpoints for the active environment.
  - Adding one remote must not alter unrelated remote keys.

### RemoteDefinition

- **Purpose**: Logical representation of one host-consumed remote capability.
- **Fields**:
  - `remoteName`: manifest key used by host loader (e.g., `ocpi-mfe`).
  - `remoteEntryUrl`: runtime URL resolved from manifest.
  - `exposedModule`: module contract key (`./Routes`).
- **Rules**:
  - `remoteName` and `exposedModule` form a contract boundary with remote repo.

### OcpiRouteBinding

- **Purpose**: Host route mapping to OCPI remote module.
- **Fields**:
  - `path`: host URL path for OCPI entry.
  - `remoteName`: `ocpi-mfe`.
  - `requiresAuth`: whether OCPI route requires authenticated session.
  - `fallbackComponent`: component shown when remote load fails.
- **Rules**:
  - Route path must be represented in sidebar menu and route config.
  - Fallback must be recoverable and not break host shell navigation.

### SidebarMenuEntry

- **Purpose**: User-facing navigation node for OCPI access in host sidebar.
- **Fields**:
  - `id`, `label`, `route`, `icon`, `requiresAuth`, `visibleWhenAuthenticated`, `order`.
- **Rules**:
  - `route` must match host OCPI route path.
  - Entry must be visible according to existing auth display rules.
  - Ordering should not reorder unrelated existing entries.

### RemoteLoadFailureState

- **Purpose**: Defined behavior when remote cannot be resolved or loaded.
- **Fields**:
  - `remoteName`
  - `attemptedPath`
  - `errorMessage`
  - `fallbackRouteOrComponent`
- **Rules**:
  - Failure affects only OCPI route.
  - Other host routes remain navigable.

## Relationships

- One `FederationManifest` contains many `RemoteDefinition` entries.
- One `RemoteDefinition` is consumed by one `OcpiRouteBinding` in this feature.
- One `OcpiRouteBinding` is exposed through one `SidebarMenuEntry`.
- `RemoteLoadFailureState` is derived from route loading attempts and consumed by fallback rendering.

## State and Lifecycle

1. **Registered**: `ocpi-mfe` key present in manifest.
2. **Resolvable**: Host can resolve `remoteEntry.json` endpoint.
3. **Loadable**: Route can import `./Routes` and resolve the remote route tree.
4. **Rendered**: OCPI remote component appears in host content outlet.
5. **Unavailable**: Route falls back to unavailable page while preserving shell operation.
