# Quickstart: Rainbow Loading Overlay

## Prerequisites

- Node.js and npm installed.
- Repository available locally.
- Dependencies installed with `npm install`.

## Development Flow

1. Start the Angular app:

   ```bash
   npm run start
   ```

2. Open the app at `http://127.0.0.1:4200`.

3. Verify startup overlay behavior:
   - A full-screen loading overlay appears above all content.
   - A centered rainbow animated loader is the main focal element.
   - A blurred, neutral skeleton layout is visible behind it (sidebar, top bar, content placeholders).

4. Verify completion behavior:
   - When application startup completes, overlay transitions to fade-out.
   - Overlay is removed/hidden after fade completes.

5. Verify reduced-motion behavior:
   - Enable reduced motion preference in browser/OS.
   - Confirm loader uses reduced-motion variant and transition timing adapts.

## Targeted Validation Commands

Run these from repository root:

```bash
npm run test -- --watch=false --include src/app/app.component.spec.ts
npm run test -- --watch=false --include src/app/layout/app-shell.component.spec.ts
npm run test:e2e -- e2e/header-clock.spec.ts
```

## Manual Regression Checklist

- Existing shell structure remains unchanged beyond loading extension.
- Sidebar, top bar, and main content still render normally after overlay exits.
- Overlay is never rendered beneath shell/header/sidebar layers.
- No flicker occurs on fast startup paths.
