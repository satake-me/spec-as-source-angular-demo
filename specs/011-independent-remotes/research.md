# Research: Independent Remotes Architecture

## Decision 1: Use Angular Native Federation for host-to-remote loading

- **Decision**: Use `@angular-architects/native-federation` in the host and keep `mf1` and `mf2` as independently published remotes.
- **Rationale**: This matches the Angular 21 standalone host pattern already validated in the reference projects and supports loading remotes from a manifest without coupling their source trees.
- **Alternatives considered**: Hardcoded dynamic imports, custom import-map wiring, or merging the remote code into the host repository. These reduce independence or create avoidable maintenance overhead.

## Decision 2: Resolve remotes through a federation manifest

- **Decision**: Keep the remote registry in `public/federation.manifest.json` and load it during application startup.
- **Rationale**: The manifest provides a stable runtime contract and can vary per environment without changing route definitions or recompiling the host.
- **Alternatives considered**: Embedding remote URLs directly in route definitions or environment files. Those approaches are more brittle and make environment changes harder to isolate.

## Decision 3: Load each remote at route level

- **Decision**: Add host routes that lazy-load `mf1` and `mf2` only when the user navigates to them.
- **Rationale**: Route-level lazy loading is the simplest Angular-native boundary and keeps the host responsive while preserving remote independence.
- **Alternatives considered**: Eager bootstrap of all remotes or a shared registry service that preloads capabilities. Those options add coupling and unnecessary startup cost.

## Decision 4: Preserve the existing bootstrap sequence

- **Decision**: Keep runtime config loading and authentication setup in the host bootstrap flow, but run federation initialization before the application bootstraps.
- **Rationale**: This preserves existing host behavior while making the manifest available before routes attempt to resolve remotes.
- **Alternatives considered**: Folding runtime config and federation initialization into one shared wrapper or moving federation setup into a route guard. Both would blur responsibilities and complicate startup.

## Decision 5: Define explicit remote contracts

- **Decision**: Require each remote to publish a stable exposed module contract, starting with `./Component`.
- **Rationale**: The host must consume a clearly defined module boundary that can evolve independently as long as the contract remains stable.
- **Alternatives considered**: Sharing internal components or state models directly between repositories. That would break repository isolation and make independent deployments unsafe.

## Decision 6: Validate with layered tests

- **Decision**: Use integration tests for manifest/route loading, component tests for shell navigation behavior, and Playwright for the user journey to external capabilities.
- **Rationale**: This gives the cheapest proof at each layer and directly matches the behavior that must remain stable.
- **Alternatives considered**: Relying only on end-to-end tests. That would be slower, more fragile, and less useful for diagnosing federation wiring problems.
