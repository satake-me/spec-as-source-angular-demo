# Quickstart: Add OCPI MFE Remote

## Prerequisites

- Node.js and npm installed.
- Host repository `spec-as-source-angular-demo` available locally.
- OCPI remote repository `ocpi-mfe` available locally.

## Development Runtime Setup

1. Ensure host federation manifest includes OCPI remote key:

   ```json
   {
     "ocpi-mfe": "http://localhost:4203/remoteEntry.json",
     "payments-mfe": "http://localhost:4204/remoteEntry.json"
   }
   ```

2. Start remotes in separate terminals:
   - `ocpi-mfe` on `4203`
   - `payments-mfe` on `4204`

3. Start host app from `spec-as-source-angular-demo`.

4. Open host and navigate to OCPI menu entry.

## Expected Host Paths

- `/ocpi`
- `/payments`

## Validation Flow

1. Confirm sidebar contains OCPI menu entry.
2. Click OCPI menu entry and verify remote module renders inside host shell.
3. Stop `ocpi-mfe` process and retry route:
   - Confirm recoverable unavailable UI is shown.
   - Confirm host can still navigate to `/home` and `/payments`.
4. Restart `ocpi-mfe` and re-open OCPI route without rebuilding host.

## Independent Delivery Check

1. Make a non-breaking UI change in `ocpi-mfe`.
2. Rebuild/restart only `ocpi-mfe`.
3. Verify host reflects updated OCPI UI while host source remains unchanged.

## Targeted Validation Commands

Run these commands from the host repository root:

```bash
npm run test -- --watch=false --include src/app/app.routes.spec.ts
npm run test:e2e -- e2e/ocpi-remote.spec.ts
npm run test:e2e -- e2e/independent-remotes.spec.ts
```
