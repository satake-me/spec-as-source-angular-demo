# Contract: Remote Component

## Purpose

Each external capability publishes a module that the host can lazy-load as a route target.

## Required Exposed Module

- `./Component`

## Expectations

- The exposed module must export the Angular component consumed by the host route.
- The host imports the exposed module by the exact contract name published by the remote.
- A remote may change its internal implementation as long as the exposed module contract remains stable.

## Host Consumption Pattern

- The host resolves the remote through the federation manifest.
- The host loads the exposed module only when the user navigates to the corresponding route.
- The host does not import internal source files from the remote repository.
