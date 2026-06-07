# Contract: Federation Manifest (OCPI Extension)

## Purpose

Define the runtime manifest contract to register the new `ocpi-mfe` remote alongside existing remotes.

## Format

```json
{
  "mf1": "http://localhost:4201/remoteEntry.json",
  "mf2": "http://localhost:4202/remoteEntry.json",
  "ocpi-mfe": "http://localhost:4203/remoteEntry.json"
}
```

## Environment Examples

- `public/federation.manifest.json`: `ocpi-mfe` -> `http://localhost:4203/remoteEntry.json`
- `public/config/federation.manifest.development.json`: `ocpi-mfe` -> `http://localhost:4203/remoteEntry.json`
- `public/config/federation.manifest.staging.json`: `ocpi-mfe` -> `https://ocpi-mfe.staging.example.com/remoteEntry.json`
- `public/config/federation.manifest.production.json`: `ocpi-mfe` -> `https://ocpi-mfe.example.com/remoteEntry.json`

## Rules

- Manifest keys are stable remote identifiers consumed by host loader.
- `ocpi-mfe` is mandatory for OCPI route resolution in development.
- Values are environment-specific URLs and may change without route path changes.
- Missing or unreachable value for one key must not block unrelated remotes.

## Environment Ownership

- Host repository owns manifest file location and schema.
- Environment operators own URL values per environment.
- Remote teams own their published `remoteEntry.json` endpoints.

## Consumer Expectations

- Host loads manifest before remote route resolution.
- Host resolves `ocpi-mfe` by exact key name.
- Route fallback behavior is triggered when OCPI remote is unavailable.
