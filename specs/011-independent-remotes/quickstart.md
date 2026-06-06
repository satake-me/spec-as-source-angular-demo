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

## Expected Host Paths

- Home page: `/`
- Remote capability 1: `/mf1`
- Remote capability 2: `/mf2`

## Validation Checklist

- The host loads without requiring the remote source code to be checked into the same repository.
- The host can reach both remotes through separate navigation entries.
- Each remote continues to render when the other remote is unavailable.
- Updating one remote does not require rebuilding unrelated remotes.
