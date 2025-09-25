import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDuration, formatPercentage } from '../../src/shared/utils/formatters';

describe('formatters', () => {
  it('formats currency with thousands separator', () => {
    expect(formatCurrency(123456)).toBe('$123,456');
  });

  it('formats percentage with digits', () => {
    expect(formatPercentage(4.234, 1)).toBe('4.2%');
  });

  it('formats duration to mm:ss', () => {
    expect(formatDuration(125)).toBe('2:05');
  });
});
