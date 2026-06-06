# Quickstart: Independent Remotes Architecture

## Prerequisites

- Node.js and npm installed.
- The host repository checked out locally.
- The external repositories for `mf1` and `mf2` available and runnable on ports `4201` and `4202`.

## Runtime Setup

1. Confirm `public/federation.manifest.json` contains the remote registry:

   ```json
   {
     "mf1": "http://localhost:4201/remoteEntry.json",
     "mf2": "http://localhost:4202/remoteEntry.json"
   }
   ```

2. Start `mf1` in its own repository on port `4201`.
3. Start `mf2` in its own repository on port `4202`.
4. Start the host application from `spec-as-source-angular-demo`.
5. Open the host and navigate to the remote capability routes.

## Independent Repository Workflow

1. In the `mf1` repository, install dependencies and run its local serve command on `4201`.
2. In the `mf2` repository, install dependencies and run its local serve command on `4202`.
3. In the host repository, install dependencies and run `npm start` on `4200`.
4. Keep each process in its own terminal so any remote can be restarted independently.

## Deployment Ownership

- Host team deploys the shell and publishes `public/federation.manifest.json` per environment.
- `mf1` team deploys and versions its own remote artifact independently.
- `mf2` team deploys and versions its own remote artifact independently.
- Updating one remote should only require manifest value changes when endpoint locations change.

## Expected Host Paths

- Home page: `/`
- Remote capability 1: `/mf1`
- Remote capability 2: `/mf2`

## Validation Checklist

- The host loads without requiring the remote source code to be checked into the same repository.
- The host can reach both remotes through separate navigation entries.
- Each remote continues to render when the other remote is unavailable.
- Updating one remote does not require rebuilding unrelated remotes.

## Isolation Validation Scenario

1. Stop `mf1` while keeping host and `mf2` running.
2. Visit `/mf1` and confirm that only this capability fails to load.
3. Visit `/mf2` and confirm it still renders.
4. Restart `mf1` and verify `/mf1` recovers without host rebuild.
