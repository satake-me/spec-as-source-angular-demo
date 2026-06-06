# Contract: Remote Route Exposure

## Purpose

Define the required federation-exposed route contract each remote repository must publish.

## Exposed module and export

Each remote MUST expose:
- Exposed module key: `./routes`
- Export: `remoteRoutes`

```ts
import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: '',
    // Initial page component for the remote domain.
    loadComponent: () => import('./path/to/initial-page.component').then((m) => m.InitialPageComponent),
  },
  // Additional remote-internal routes allowed.
];
```

## Required behavior

- Root path (`''`) MUST render an initial landing page:
- OCPI remote: OCPI initial module page.
- Gateways remote: Gateways initial module page.
- Remote routes MUST not depend on shell-private services/components.
- Remote routes MAY define child routes under their own top-level domain.

## Error and resilience expectations

- Remote bootstrap failures must surface explicit errors consumable by shell fallback UI.
- Remotes must tolerate reload after transient shell-side retry without full shell restart.

## Versioning policy

- Removing `./routes` or renaming `remoteRoutes` is a breaking change.
- Additive child routes are non-breaking when default route remains compatible.
