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

## Consumer Expectations

- The host loads the manifest before route resolution.
- A missing or unreachable remote entry affects only that remote, not the host shell or other remotes.
