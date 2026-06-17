import type { AmaNode } from '../../ReactNativeAma.types';
import { checkContrast } from './checkContrast';

jest.mock('../utils/ignoreContrastCheck', () => ({
  shouldIgnoreContrastCheckForDisabledElement: jest.fn(() => false),
}));

jest.mock('../utils/getRuleAction', () => ({
  getRuleAction: jest.fn(() => 'SHOULD'),
}));

beforeEach(() => {
  jest.clearAllMocks();
  const { getRuleAction } = require('../utils/getRuleAction');
  getRuleAction.mockReturnValue('SHOULD');

  const { shouldIgnoreContrastCheckForDisabledElement } = require('../utils/ignoreContrastCheck');
  shouldIgnoreContrastCheckForDisabledElement.mockReturnValue(false);
});

// Contrast ratios (verified against WCAG algorithm):
// #000000 on #FFFFFF = 21.00:1
// #595959 on #FFFFFF =  7.00:1  (passes AAA normal: >=7.0)
// #606060 on #FFFFFF =  6.29:1  (fails AAA normal, passes AA)
// #757575 on #FFFFFF =  4.61:1  (fails AAA normal, passes AA)
// #777777 on #FFFFFF =  4.48:1  (fails AA normal)
// #909090 on #FFFFFF =  3.19:1  (fails AAA large: <4.5, passes AA large: >=3.0)
// #949494 on #FFFFFF =  3.03:1  (fails AAA large, passes AA large)
// #959595 on #FFFFFF =  2.99:1  (fails AA large: <3.0)

describe('checkContrast', () => {
  const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
    type: 'Text',
    viewId: 1,
    bounds: [0, 0, 100, 100],
    content: 'Test content',
    fg: '#000000',
    bg: '#FFFFFF',
    fontSize: 16,
    isBold: false,
    isEnabled: true,
    isAccessible: true,
    hasOnSubmitEditing: false,
    ...overrides,
  });

  describe('Color conversion and contrast calculation', () => {
    it('passes with high contrast black on white (21:1 ratio)', () => {
      expect(checkContrast(createNode({ fg: '#000000', bg: '#FFFFFF' }))).toBeNull();
    });

    it('passes with white on black', () => {
      expect(checkContrast(createNode({ fg: '#FFFFFF', bg: '#000000' }))).toBeNull();
    });

    it('handles shorthand hex colors (#FFF)', () => {
      expect(checkContrast(createNode({ fg: '#000', bg: '#FFF' }))).toBeNull();
    });

    it('handles hex colors without # prefix', () => {
      expect(checkContrast(createNode({ fg: '000000', bg: 'FFFFFF' }))).toBeNull();
    });
  });

  describe('WCAG AA compliance (normal text)', () => {
    it('fails AA with contrast ratio below 4.5:1 for normal text', () => {
      // #777777 on white = 4.48:1 — fails AA
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED', viewId: 1 });
      expect(result?.extra).toContain('4.5');
    });

    it('passes AA with contrast ratio >=4.5:1 for normal text (reports AAA failure)', () => {
      // #757575 on white = 4.61:1 — passes AA, fails AAA (< 7.0)
      const node = createNode({ fg: '#757575', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED_AAA' });
    });
  });

  describe('WCAG AAA compliance', () => {
    it('fails AAA with contrast ratio below 7:1 for normal text', () => {
      // #606060 on white = 6.29:1 — passes AA, fails AAA
      const node = createNode({ fg: '#606060', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED_AAA', viewId: 1 });
      expect(result?.extra).toContain('7');
    });

    it('passes AAA with 7:1 contrast ratio for normal text', () => {
      // #595959 on white = exactly 7.00:1 — passes AAA
      const node = createNode({ fg: '#595959', bg: '#FFFFFF', fontSize: 16 });
      expect(checkContrast(node)).toBeNull();
    });
  });

  describe('Large text rules', () => {
    it('treats 18pt text as large — AAA requires 4.5:1 for large text', () => {
      // #909090 on white = 3.19:1 — passes large AA (>=3.0), fails large AAA (< 4.5)
      const node = createNode({ fg: '#909090', bg: '#FFFFFF', fontSize: 18 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED_AAA' });
      expect(result?.extra).toContain('4.5');
    });

    it('treats 14pt bold text as large', () => {
      // #949494 on white = 3.03:1 — passes large AA (>=3.0), fails large AAA (< 4.5)
      const node = createNode({ fg: '#949494', bg: '#FFFFFF', fontSize: 14, isBold: true });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED_AAA' });
    });

    it('does not treat 14pt non-bold text as large (uses normal text thresholds)', () => {
      // #949494 = 3.03:1 — fails normal AA (<4.5), and with AAA disabled, returns CONTRAST_FAILED
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#949494', bg: '#FFFFFF', fontSize: 14, isBold: false });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED' });
    });

    it('fails AA for large text with contrast below 3:1', () => {
      // #959595 on white = 2.99:1 — fails large AA (<3.0)
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#959595', bg: '#FFFFFF', fontSize: 18 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED' });
      expect(result?.extra).toContain('3.0');
    });
  });

  describe('Edge cases and validation', () => {
    it('returns null when foreground color is missing', () => {
      expect(checkContrast(createNode({ fg: undefined }))).toBeNull();
    });

    it('returns null when background color is missing', () => {
      expect(checkContrast(createNode({ bg: undefined }))).toBeNull();
    });

    it('returns null when content is missing (icon-only buttons)', () => {
      expect(checkContrast(createNode({ content: undefined }))).toBeNull();
    });

    it('returns null when content is empty string', () => {
      expect(checkContrast(createNode({ content: '' }))).toBeNull();
    });

    it('handles unknown/invalid hex color for foreground gracefully', () => {
      // Invalid hex → luminance 0 → very high contrast with white → passes or fails depending on bg
      // 'invalid' gives luminance 0, white gives 1.0, contrast = 21:1 → passes
      // This verifies we don't throw on invalid input
      expect(() => checkContrast(createNode({ fg: 'invalid', bg: '#FFFFFF' }))).not.toThrow();
    });

    it('handles unknown/invalid hex color for background gracefully', () => {
      expect(() => checkContrast(createNode({ fg: '#000000', bg: 'invalid' }))).not.toThrow();
    });
  });

  describe('Disabled element handling', () => {
    it('checks contrast for disabled elements when ignore setting is false', () => {
      const { shouldIgnoreContrastCheckForDisabledElement } = require('../utils/ignoreContrastCheck');
      shouldIgnoreContrastCheckForDisabledElement.mockReturnValue(false);

      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      // #777777 = 4.48:1 — fails AA for normal text
      const node = createNode({ isEnabled: false, fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      expect(checkContrast(node)).not.toBeNull();
    });

    it('skips contrast check for disabled elements when ignore setting is true', () => {
      const { shouldIgnoreContrastCheckForDisabledElement } = require('../utils/ignoreContrastCheck');
      shouldIgnoreContrastCheckForDisabledElement.mockReturnValue(true);

      const node = createNode({ isEnabled: false, fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      expect(checkContrast(node)).toBeNull();
    });
  });

  describe('Error message formatting', () => {
    it('includes foreground and background colors in error message', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      // #777777 = 4.48:1 — fails AA
      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result?.extra).toContain('#777777');
      expect(result?.extra).toContain('#FFFFFF');
    });

    it('includes calculated contrast ratio in error message', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result?.extra).toMatch(/\d+\.\d{2}/);
    });

    it('includes required contrast ratio in error message', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result?.extra).toContain('4.5');
    });

    it('includes ariaLabel in error when present', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16, ariaLabel: 'Test button' });
      const result = checkContrast(node);
      expect(result?.label).toBe('Test button');
    });

    it('includes viewId in error', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16, viewId: 12345 });
      const result = checkContrast(node);
      expect(result?.viewId).toBe(12345);
    });
  });

  describe('AAA config-driven behavior', () => {
    it('reports AAA failure when AAA check is enabled', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('SHOULD');

      // #606060 on white = 6.29:1 — passes AA, fails AAA
      const node = createNode({ fg: '#606060', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED_AAA' });
    });

    it('does not report AAA failure when AAA check is disabled', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      // #606060 on white = 6.29:1 — passes AA, so no error when AAA disabled
      const node = createNode({ fg: '#606060', bg: '#FFFFFF', fontSize: 16 });
      expect(checkContrast(node)).toBeNull();
    });

    it('reports AA failure regardless of AAA config', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      // #777777 on white = 4.48:1 — fails AA
      const node = createNode({ fg: '#777777', bg: '#FFFFFF', fontSize: 16 });
      const result = checkContrast(node);
      expect(result).toMatchObject({ rule: 'CONTRAST_FAILED' });
    });

    it('returns null when contrast passes AA and AAA is disabled', () => {
      const { getRuleAction } = require('../utils/getRuleAction');
      getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');

      // #757575 on white = 4.61:1 — passes AA
      const node = createNode({ fg: '#757575', bg: '#FFFFFF', fontSize: 16 });
      expect(checkContrast(node)).toBeNull();
    });
  });
});
