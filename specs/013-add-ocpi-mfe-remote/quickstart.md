# Quickstart: Add OCPI MFE Remote

## Prerequisites

- Node.js and npm installed.
- Host repository `spec-as-source-angular-demo` available locally.
- OCPI remote repository `ocpi-mfe` available locally.

## Development Runtime Setup

1. Ensure host federation manifest includes OCPI remote key:

   ```json
   {
     "mf1": "http://localhost:4201/remoteEntry.json",
     "mf2": "http://localhost:4202/remoteEntry.json",
     "ocpi-mfe": "http://localhost:4203/remoteEntry.json"
   }
   ```

2. Start remotes in separate terminals:
   - `mf1` on `4201`
   - `mf2` on `4202`
   - `ocpi-mfe` on `4203`

3. Start host app from `spec-as-source-angular-demo`.

4. Open host and navigate to OCPI menu entry.

## Expected Host Paths

- Existing remotes:
  - `/mf1`
  - `/mf2`
- New OCPI route:
  - `/ocpi` (or configured OCPI path in route and menu contracts)

## Validation Flow

1. Confirm sidebar contains OCPI menu entry.
2. Click OCPI menu entry and verify remote module renders inside host shell.
3. Stop `ocpi-mfe` process and retry route:
   - Confirm recoverable unavailable UI is shown.
   - Confirm host can still navigate to `/home`, `/mf1`, `/mf2`.
4. Restart `ocpi-mfe` and re-open OCPI route without rebuilding host.

## Independent Delivery Check

1. Make a non-breaking UI change in `ocpi-mfe`.
2. Rebuild/restart only `ocpi-mfe`.
3. Verify host reflects updated OCPI UI while host source remains unchanged.
