const { test, expect } = require('@playwright/test');

test('Formulario Productos', async ({ page }) => {

  await page.goto('http://localhost/6_api_preguntas/index.html');

  await page.fill('#txtPregunta', 'Hola desde Playwright');
  await page.fill('#txtValor', '10');

  await page.waitForTimeout(3000);
  await expect(page.locator('#txtPregunta')).toHaveValue('Hola desde Playwright');
});