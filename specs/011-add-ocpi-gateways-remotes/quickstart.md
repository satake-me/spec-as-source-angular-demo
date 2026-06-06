# Quickstart: OCPI and Gateways Remote Microfrontends

## Objective

Add two independently hosted Angular remotes (OCPI and Gateways) and integrate both into shell navigation/menu using Native Federation per ADR-002.

## Prerequisites

- Angular shell project available (this repository).
- Ability to create and manage two additional repositories.
- Team agreement on remote endpoint URLs per environment.
- Shared Angular major versions across shell and remotes.

## Repository targets

- Shell: current repository (`spec-as-source-angular-demo`)
- New remote repository 1: `mf-ocpi`
- New remote repository 2: `mf-gateways`

## Implementation steps

### 1. Bootstrap two remote Angular projects (separate repos)

- Initialize `mf-ocpi` with Angular project structure and Native Federation remote configuration.
- Initialize `mf-gateways` with the same architecture and conventions.
- In each remote, expose `./routes` and `remoteRoutes` entry.

Bootstrap sequence used for this feature slice:

```bash
# from /home/thiago/develop/sources/github.com/satake-me
mkdir -p mf-ocpi/src/app/features/ocpi mf-ocpi/src/federation
mkdir -p mf-gateways/src/app/features/gateways mf-gateways/src/federation
```

Scaffolded remote files:
- `mf-ocpi/package.json`
- `mf-ocpi/src/app/app.routes.ts`
- `mf-ocpi/src/app/features/ocpi/ocpi-home-page.component.ts`
- `mf-ocpi/src/federation/exposes.routes.ts`
- `mf-gateways/package.json`
- `mf-gateways/src/app/app.routes.ts`
- `mf-gateways/src/app/features/gateways/gateways-home-page.component.ts`
- `mf-gateways/src/federation/exposes.routes.ts`

### 2. Add initial remote pages

- In `mf-ocpi`, implement OCPI initial page at remote root route.
- In `mf-gateways`, implement Gateways initial page at remote root route.
- Keep initial pages minimal, typed, and independently testable.

### 3. Configure shell runtime remote registry

- Add OCPI and Gateways entries to shell runtime remote registry/manifest.
- Ensure `routePath` and menu labels are unique and aligned with desired user navigation.
- Keep `remoteEntry` URLs environment-driven.

### 4. Wire shell routes and menu entries

- Register top-level shell routes for `ocpi` and `gateways` using remote route loading.
- Add or project menu entries so each remote is directly selectable.
- Apply existing permission visibility rules to both entries.

### 5. Implement shell fallback behavior

- Add/confirm standardized unavailable-module state for remote load failures.
- Verify shell navigation remains operational after remote errors.

### 6. Validate contracts and tests

- Shell tests: remote registry parsing, route wiring, menu visibility, fallback behavior.
- Remote tests: initial page render and root route exposure.
- E2E: login -> menu select OCPI/Gateways -> remote loads.

## Validation checklist

- OCPI and Gateways exist as separate repositories and independent CI pipelines.
- Each remote exposes compatible `./routes` with `remoteRoutes`.
- Shell can navigate to `/ocpi` and `/gateways` from menu.
- Unauthorized users do not see or access restricted remote entries.
- A failed remote load shows recovery UI without breaking shell navigation.

## Suggested commands

Shell repo:

```bash
npm install
npm run lint
npm run test -- --watch=false
npm run test:e2e -- e2e/sidebar-menu.spec.ts
```

Remote repos (each):

```bash
npm install
npm run lint
npm run test -- --watch=false
npm run build
```

Notes:
- Keep environment-specific remote endpoints out of hardcoded route definitions.
- Align federation plugin/library versions between shell and remotes.
- During shell-only local runs, unresolved remote endpoints should surface fallback UI rather than break shell navigation.
