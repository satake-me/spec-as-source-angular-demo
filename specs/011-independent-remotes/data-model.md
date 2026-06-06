# Data Model: Independent Remotes Architecture

## Entities

### FederationManifest

- **Purpose**: Maps host-visible capability names to their published remote entry locations.
- **Fields**:
  - `mf1`: remote entry URL for the catalog capability.
  - `mf2`: remote entry URL for the operational capability.
- **Rules**:
  - Each remote name must be unique.
  - Each remote entry URL must be resolvable by the host at runtime.
  - The manifest must be safe to change per environment without code changes.

### ExternalCapability

- **Purpose**: Represents one externally delivered application capability.
- **Fields**:
  - `name`: stable remote name used by the host.
  - `remoteEntryUrl`: published location of the remote registry payload.
  - `exposedModule`: published entry point consumed by the host.
  - `routePath`: host-visible navigation path.
  - `displayName`: user-facing label.
  - `availability`: runtime state such as reachable or unavailable.
- **Rules**:
  - Each capability must be independently deployable.
  - Each capability must preserve its public module contract across deployments.

### HostNavigationEntry

- **Purpose**: Describes how the host exposes a capability to the user.
- **Fields**:
  - `path`: Angular route path.
  - `title`: navigation label.
  - `icon`: optional presentation metadata.
  - `requiresAuth`: whether the entry is visible only for authenticated users.
- **Rules**:
  - Navigation entries must map to a single capability or local page.
  - Navigation metadata must remain typed and consistent with the existing sidebar configuration.

### RemoteComponentContract

- **Purpose**: Defines the module boundary the host imports from each remote.
- **Fields**:
  - `exposedModule`: expected exposed key, currently `./Component`.
  - `exportedComponent`: Angular component exported by the remote module.
- **Rules**:
  - The host must import the exact exposed module key published by the remote.
  - The remote component contract must stay stable unless the host route contract is updated in lockstep.

## Isolation Guidance

- The host depends only on published federation contracts (`remoteName`, manifest URL, exposed module key).
- Remote repositories own internal component structure, dependencies, and release cadence.
- Host code must not import remote source internals or repository-local paths.
- Contract changes must be introduced through explicit versioned boundary updates, not implicit source coupling.

## Relationships

- A single `FederationManifest` contains many `ExternalCapability` entries.
- Each `ExternalCapability` maps to one `HostNavigationEntry`.
- Each `ExternalCapability` publishes one `RemoteComponentContract` consumed by the host.
- The host application owns the navigation shell and consumes all external capability contracts.

## State and Lifecycle

- **Registered**: The capability is listed in the federation manifest.
- **Reachable**: The capability loads successfully from the host route.
- **Unavailable**: The host cannot load the remote entry, but unrelated capabilities remain available.
- **Updated Independently**: The remote publishes a new version without requiring a coordinated redeploy of other remotes.
