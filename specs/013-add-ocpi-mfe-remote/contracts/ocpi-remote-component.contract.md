# Contract: OCPI Remote Component

## Purpose

Define the host-to-remote component boundary for `ocpi-mfe` integration.

## Required Exposed Module

- `./Component`

## Required Remote Identifier

- `ocpi-mfe`

## Required Development Entry

- `http://localhost:4203/remoteEntry.json`

## Stable Boundary

- Host imports remote module via `loadRemoteModule('ocpi-mfe', './Component')`.
- Host resolves `OcpiMfeComponent` from the exposed module for the `/ocpi` route.
- Host must not import source files directly from `ocpi-mfe` repository.

## Host Route Binding

- Host path: `/ocpi`
- Host route metadata:
	- `title`: `OCPI Modules`
	- `icon`: `hub`
- Host fallback on failure: `RemoteUnavailablePageComponent`

## Expectations

- Remote must publish `./Component` in its federation configuration.
- Exposed module must export the Angular standalone component expected by host route binding.
- Breaking changes to exposed key or export name require explicit host contract update.

## Failure Contract

- If remote entry cannot be reached or component cannot be resolved, host must render the remote-unavailable fallback and keep shell navigation operational.
