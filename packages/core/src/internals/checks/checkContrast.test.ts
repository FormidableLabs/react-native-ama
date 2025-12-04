import type { AmaNode } from '../../ReactNativeAma.types';
import { checkContrast } from './checkContrast';

jest.mock('../utils/ignoreContrastCheck', () => ({
    shouldIgnoreContrastCheckForDisabledElement: jest.fn(() => false),
}));

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
        hasOnSubmitEditing: false,
        ...overrides,
    });

    describe('Color conversion and contrast calculation', () => {
        it('passes with high contrast black on white (21:1 ratio)', () => {
            const node = createNode({
                fg: '#000000',
                bg: '#FFFFFF',
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('passes with white on black', () => {
            const node = createNode({
                fg: '#FFFFFF',
                bg: '#000000',
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('handles shorthand hex colors (#FFF)', () => {
            const node = createNode({
                fg: '#000',
                bg: '#FFF',
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('handles hex colors without # prefix', () => {
            const node = createNode({
                fg: '000000',
                bg: 'FFFFFF',
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });
    });

    describe('WCAG AA compliance (normal text)', () => {
        it('fails AA with 4.4:1 contrast ratio for normal text', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
                isBold: false,
            });

            const result = checkContrast(node);
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED',
                viewId: 1,
            });
            expect(result?.extra).toContain('4.5');
        });

        it('passes AA with 4.5:1 contrast ratio for normal text', () => {
            const node = createNode({
                fg: '#757575',
                bg: '#FFFFFF',
                fontSize: 16,
                isBold: false,
            });

            const result = checkContrast(node);
            // Should pass AA but fail AAA
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED_AAA',
            });
        });
    });

    describe('WCAG AAA compliance', () => {
        it('fails AAA with 6.9:1 contrast ratio for normal text', () => {
            const node = createNode({
                fg: '#595959',
                bg: '#FFFFFF',
                fontSize: 16,
                isBold: false,
            });

            const result = checkContrast(node);
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED_AAA',
                viewId: 1,
            });
            expect(result?.extra).toContain('7.0');
        });

        it('passes AAA with 7:1 contrast ratio for normal text', () => {
            const node = createNode({
                fg: '#585858',
                bg: '#FFFFFF',
                fontSize: 16,
                isBold: false,
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });
    });

    describe('Large text rules', () => {
        it('treats 18pt text as large', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 18,
                isBold: false,
            });

            // 4.4:1 contrast is acceptable for large text (AA requires 3:1)
            const result = checkContrast(node);
            // Should pass AA but fail AAA
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED_AAA',
            });
            expect(result?.extra).toContain('4.5'); // AAA requires 4.5:1 for large text
        });

        it('treats 14pt bold text as large', () => {
            const node = createNode({
                fg: '#949494',
                bg: '#FFFFFF',
                fontSize: 14,
                isBold: true,
            });

            // 3:1 contrast is acceptable for large text (AA requires 3:1)
            const result = checkContrast(node);
            // Should pass AA but fail AAA
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED_AAA',
            });
        });

        it('does not treat 14pt non-bold text as large', () => {
            const node = createNode({
                fg: '#949494',
                bg: '#FFFFFF',
                fontSize: 14,
                isBold: false,
            });

            // 3:1 contrast fails AA for normal text (requires 4.5:1)
            const result = checkContrast(node);
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED',
            });
        });

        it('fails AA for large text below 3:1 contrast', () => {
            const node = createNode({
                fg: '#959595',
                bg: '#FFFFFF',
                fontSize: 18,
                isBold: false,
            });

            const result = checkContrast(node);
            expect(result).toMatchObject({
                rule: 'CONTRAST_FAILED',
            });
            expect(result?.extra).toContain('3.0'); // AA requires 3:1 for large text
        });
    });

    describe('Edge cases and validation', () => {
        it('returns null when foreground color is missing', () => {
            const node = createNode({
                fg: undefined,
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('returns null when background color is missing', () => {
            const node = createNode({
                bg: undefined,
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('returns null when content is missing (icon-only buttons)', () => {
            const node = createNode({
                content: undefined,
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('returns null when content is empty string', () => {
            const node = createNode({
                content: '',
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });

        it('handles invalid hex color for foreground', () => {
            const node = createNode({
                fg: 'invalid',
                bg: '#FFFFFF',
            });

            const result = checkContrast(node);
            // With luminance 0 for invalid color, should fail
            expect(result).not.toBeNull();
        });

        it('handles invalid hex color for background', () => {
            const node = createNode({
                fg: '#000000',
                bg: 'invalid',
            });

            const result = checkContrast(node);
            // With luminance 0 for invalid color, should fail
            expect(result).not.toBeNull();
        });
    });

    describe('Disabled element handling', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
        });

        it('checks contrast for disabled elements when ignore setting is false', () => {
            const {
                shouldIgnoreContrastCheckForDisabledElement,
            } = require('../utils/ignoreContrastCheck');

            shouldIgnoreContrastCheckForDisabledElement.mockReturnValue(false);

            const node = createNode({
                isEnabled: false,
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
            });

            const result = checkContrast(node);
            expect(result).not.toBeNull();
        });

        it('skips contrast check for disabled elements when ignore setting is true', () => {
            const {
                shouldIgnoreContrastCheckForDisabledElement,
            } = require('../utils/ignoreContrastCheck');

            shouldIgnoreContrastCheckForDisabledElement.mockReturnValue(true);

            const node = createNode({
                isEnabled: false,
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
            });

            const result = checkContrast(node);
            expect(result).toBeNull();
        });
    });

    describe('Error message formatting', () => {
        it('includes foreground and background colors in error message', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
            });

            const result = checkContrast(node);
            expect(result?.extra).toContain('#767676');
            expect(result?.extra).toContain('#FFFFFF');
        });

        it('includes calculated contrast ratio in error message', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
            });

            const result = checkContrast(node);
            expect(result?.extra).toMatch(/\d+\.\d{2}/); // Should contain a number with 2 decimal places
        });

        it('includes required contrast ratio in error message', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
            });

            const result = checkContrast(node);
            expect(result?.extra).toContain('4.5');
        });

        it('includes ariaLabel in error when present', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
                ariaLabel: 'Test button',
            });

            const result = checkContrast(node);
            expect(result?.label).toBe('Test button');
        });

        it('includes viewId in error', () => {
            const node = createNode({
                fg: '#767676',
                bg: '#FFFFFF',
                fontSize: 16,
                viewId: 12345,
            });

            const result = checkContrast(node);
            expect(result?.viewId).toBe(12345);
        });
    });
});
