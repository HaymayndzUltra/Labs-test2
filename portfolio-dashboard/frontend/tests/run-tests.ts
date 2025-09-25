import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { formatChange, formatCurrency, formatDuration, formatInteger, formatRate } from '../src/lib/formatting.js';
import { useDashboardStore } from '../src/store/dashboardStore.js';

async function testFormatting() {
  assert.match(formatCurrency(1234), /\$1,234/);
  assert.equal(formatInteger(9876), '9,876');
  assert.equal(formatRate(0.236), '23.6%');
  assert.equal(formatDuration(125), '02:05');
  assert.equal(formatChange(-4.5), '-4.5%');
  assert.equal(formatChange(3.2), '+3.2%');
}

async function testStore() {
  const initial = useDashboardStore.getState().filters.vertical;
  assert.equal(initial, 'saas');
  useDashboardStore.getState().setFilter('vertical', 'commerce');
  assert.equal(useDashboardStore.getState().filters.vertical, 'commerce');
  const featureFlagKey = 'saas.anomaly-detection';
  const previous = useDashboardStore.getState().featureFlags[featureFlagKey];
  useDashboardStore.getState().toggleFeatureFlag({ module: 'saas', flag: 'anomaly-detection' });
  assert.equal(useDashboardStore.getState().featureFlags[featureFlagKey], !previous);
  useDashboardStore.getState().pushLiveEvent({ id: 'test', kpi: 'MRR', delta: 1.1, timestamp: Date.now() });
  assert.ok(useDashboardStore.getState().liveEvents.length >= 1);
}

async function testDesignTokens() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  globalThis.window = dom.window as unknown as Window & typeof globalThis;
  globalThis.document = dom.window.document;
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const candidatePaths = [
    resolve(currentDir, '../src/theme/global.css'),
    resolve(currentDir, '../../src/theme/global.css'),
  ];
  const cssPath = candidatePaths.find((path) => existsSync(path));
  if (!cssPath) {
    throw new Error('Unable to locate global.css for design token test');
  }
  const style = document.createElement('style');
  let css = readFileSync(cssPath, 'utf-8');
  const tokensPath = resolve(dirname(cssPath), 'design-tokens.css');
  if (existsSync(tokensPath)) {
    const tokens = readFileSync(tokensPath, 'utf-8');
    css = css.replace(/@import\s+['"]\.\/design-tokens\.css['"];?/, tokens);
  }
  style.textContent = css;
  document.head.appendChild(style);
  const computed = window.getComputedStyle(document.documentElement);
  assert.notEqual(computed.getPropertyValue('--surface-s0').trim(), '');
  document.documentElement.setAttribute('data-theme', 'dark');
  const darkComputed = window.getComputedStyle(document.documentElement);
  assert.notEqual(darkComputed.getPropertyValue('--surface-s0').trim(), computed.getPropertyValue('--surface-s0').trim());
}

async function run() {
  await testFormatting();
  await testStore();
  await testDesignTokens();
  // eslint-disable-next-line no-console
  console.log('All tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
