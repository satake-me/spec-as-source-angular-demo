import { expect, test } from '@playwright/test';

test.describe('OCPI remote integration', () => {
  test('renders OCPI route through host navigation path', async ({ page }) => {
    await page.goto('/ocpi');
    await expect(page).toHaveURL(/\/ocpi$/);
    await expect(page.getByRole('heading', { name: /remote application unavailable/i })).not.toBeVisible();
  });

  test('shows fallback page when OCPI remote entry is unavailable', async ({ page }) => {
    await page.route('**/remoteEntry.json', async (route) => {
      if (route.request().url().includes('4203')) {
        await route.abort();
        return;
      }

      await route.continue();
    });

    await page.goto('/ocpi');
    await expect(page).toHaveURL(/\/ocpi$/);
    await expect(page.getByRole('heading', { name: /remote application unavailable/i })).toBeVisible();

    await page.getByRole('link', { name: /go to home instead/i }).click();
    await expect(page).toHaveURL(/\/home$/);
  });
});
