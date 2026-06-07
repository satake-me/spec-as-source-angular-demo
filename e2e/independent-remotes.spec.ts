import { expect, test } from '@playwright/test';

test.describe('Independent remotes', () => {
	test('loads mf1 and mf2 through host routes', async ({ page }) => {
		await page.goto('/mf1');
		await expect(page).toHaveURL(/\/mf1$/);
		await expect(page.getByRole('heading', { name: /catalogo carregado via federation/i })).toBeVisible();

		await page.goto('/mf2');
		await expect(page).toHaveURL(/\/mf2$/);
		await expect(page.getByRole('heading', { name: /dashboard operacional federado/i })).toBeVisible();
	});

	test('keeps mf2 available when mf1 remote entry is unavailable', async ({ page }) => {
		await page.route('**/remoteEntry.json', async (route) => {
			if (route.request().url().includes('4201')) {
				await route.abort();
				return;
			}

			await route.continue();
		});

		await page.goto('/mf1');
		await expect(page).toHaveURL(/\/mf1$/);

		await page.goto('/mf2');
		await expect(page).toHaveURL(/\/mf2$/);
		await expect(page.getByRole('heading', { name: /dashboard operacional federado/i })).toBeVisible();
	});

	test('keeps mf1 and mf2 available when ocpi-mfe remote entry is unavailable', async ({ page }) => {
		await page.route('**/remoteEntry.json', async (route) => {
			if (route.request().url().includes('4203')) {
				await route.abort();
				return;
			}

			await route.continue();
		});

		await page.goto('/ocpi');
		await expect(page.getByRole('heading', { name: /remote application unavailable/i })).toBeVisible();

		await page.goto('/mf1');
		await expect(page).toHaveURL(/\/mf1$/);
		await expect(page.getByRole('heading', { name: /catalogo carregado via federation/i })).toBeVisible();

		await page.goto('/mf2');
		await expect(page).toHaveURL(/\/mf2$/);
		await expect(page.getByRole('heading', { name: /dashboard operacional federado/i })).toBeVisible();
	});
});