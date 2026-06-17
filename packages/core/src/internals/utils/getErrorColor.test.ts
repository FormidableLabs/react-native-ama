import { getErrorColor } from './getErrorColor';

describe('getErrorColor', () => {
  it('returns the Critical color for a Critical severity rule', () => {
    const color = getErrorColor('NO_ACCESSIBILITY_LABEL');
    expect(color).toBe('#f00');
  });

  it('returns the Serious color for a Serious severity rule', () => {
    const color = getErrorColor('CONTRAST_FAILED');
    expect(color).toBe('#2563EB');
  });

  it('returns the Critical color (fallback) for an unknown rule', () => {
    const color = getErrorColor('UNKNOWN_RULE' as any);
    expect(color).toBe('#f00');
  });
});
