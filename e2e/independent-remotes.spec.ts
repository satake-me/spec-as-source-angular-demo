import { expect, test } from '@playwright/test';

test.describe('Independent remotes', () => {
	test('loads ocpi and payments through host routes', async ({ page }) => {
		await page.goto('/ocpi');
		await expect(page).toHaveURL(/\/ocpi$/);
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).not.toBeVisible();

		await page.goto('/payments');
		await expect(page).toHaveURL(/\/payments$/);
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).not.toBeVisible();
	});

	test('keeps payments available when ocpi-mfe remote entry is unavailable', async ({ page }) => {
		await page.route('**/remoteEntry.json', async (route) => {
			if (route.request().url().includes('4203')) {
				await route.abort();
				return;
			}

			await route.continue();
		});

		await page.goto('/ocpi');
		await expect(page).toHaveURL(/\/ocpi$/);

		await page.goto('/payments');
		await expect(page).toHaveURL(/\/payments$/);
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).not.toBeVisible();
	});

	test('keeps ocpi available when payments-mfe remote entry is unavailable', async ({ page }) => {
		await page.route('**/remoteEntry.json', async (route) => {
			if (route.request().url().includes('4204')) {
				await route.abort();
				return;
			}

			await route.continue();
		});

		await page.goto('/payments');
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).toBeVisible();

		await page.goto('/ocpi');
		await expect(page).toHaveURL(/\/ocpi$/);
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).not.toBeVisible();
	});
});