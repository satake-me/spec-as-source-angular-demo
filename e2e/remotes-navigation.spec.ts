import { expect, test } from '@playwright/test';

test.describe('Remote navigation scaffolding', () => {
  test('hides OCPI and Gateways entries for anonymous visitors', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: /primary navigation/i });
    await expect(nav).not.toContainText('OCPI');
    await expect(nav).not.toContainText('Gateways');
  });

  test.skip('shows OCPI and Gateways entries for authenticated users', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: /primary navigation/i });
    await expect(nav).toContainText('OCPI');
    await expect(nav).toContainText('Gateways');
  });

  test('redirects anonymous users when they open the OCPI route', async ({ page }) => {
    await page.goto('/ocpi');
    await expect(page).toHaveURL(/\?redirectTo=%2Focpi$/);
  });

  test('redirects anonymous users when they open the Gateways route', async ({ page }) => {
    await page.goto('/gateways');
    await expect(page).toHaveURL(/\?redirectTo=%2Fgateways$/);
  });

  test('navigates across guarded remote routes and returns to an existing route', async ({ page }) => {
    await page.goto('/ocpi');
    await expect(page).toHaveURL(/\?redirectTo=%2Focpi$/);

    await page.goto('/gateways');
    await expect(page).toHaveURL(/\?redirectTo=%2Fgateways$/);

    await page.goto('/home');
    await expect(page).toHaveURL(/\?redirectTo=%2Fhome$/);
  });
});
