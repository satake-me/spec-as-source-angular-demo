import { expect, test } from '@playwright/test';

test.describe('Loading overlay', () => {
  test('shows loader above layout while menu config is loading, then fades out', async ({ page }) => {
    await page.route('**/config/sidebar-menu.json', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await route.continue();
    });

    await page.goto('/');

    const overlay = page.getByTestId('loading-overlay');
    const loader = page.getByTestId('loading-rainbow-loader');
    await expect(overlay).toBeVisible();
    await expect(loader).toBeVisible();

    await expect(page.getByTestId('loading-skeleton-sidebar')).toBeVisible();
    await expect(page.getByTestId('loading-skeleton-topbar')).toBeVisible();

    await expect(overlay).toBeHidden({ timeout: 5000 });
  });

  test('keeps overlay hierarchy with skeleton behind loader', async ({ page }) => {
    await page.route('**/config/sidebar-menu.json', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });

    await page.goto('/');

    const overlay = page.getByTestId('loading-overlay');
    await expect(overlay).toBeVisible();

    const loaderZIndex = await page.getByTestId('loading-rainbow-loader').evaluate((el) => {
      return Number.parseInt(getComputedStyle(el).zIndex || '1', 10);
    });

    const skeletonZIndex = await page.getByTestId('loading-overlay-skeleton').evaluate((el) => {
      return Number.parseInt(getComputedStyle(el).zIndex || '0', 10);
    });

    expect(loaderZIndex).toBeGreaterThanOrEqual(skeletonZIndex);
  });
});
