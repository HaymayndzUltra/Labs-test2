import { test, expect } from '@playwright/test';

test('module switcher keyboard navigation', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/finops/);
});
