# Contract: Federation Manifest

## Purpose

The federation manifest publishes the host-readable locations for each external capability.

## Format

```json
{
  "mf1": "http://localhost:4201/remoteEntry.json",
  "mf2": "http://localhost:4202/remoteEntry.json"
}
```

## Rules

- Each key is a stable remote name used by the host.
- Each value is the remote entry URL published by that capability.
- The host may add new remotes by extending the manifest without changing the source contract of unrelated remotes.

## Environment Ownership

- The host repository owns the manifest file location and shape.
- Environment operators own the URL values per deployment target (`development`, `staging`, `production`).
- Remote teams own the published `remoteEntry.json` endpoint behind each manifest value.

## Versioning Notes

- Manifest keys (`mf1`, `mf2`) are treated as stable identifiers and are versioned as part of the host route contract.
- URL values may change between environments or remote releases without requiring host route rewrites.
- If a remote requires a breaking contract change, publish it behind a new manifest key and migrate host routes explicitly.

## Consumer Expectations

- The host loads the manifest before route resolution.
- A missing or unreachable remote entry affects only that remote, not the host shell or other remotes.
