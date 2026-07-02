import type { AmaNode } from '../../ReactNativeAma.types';
import type { AmaRule } from '../types';
import { checkIsUppercase } from './checkIsUppercase';

jest.mock('../utils/isA11yLabelAllowed', () => ({
    isAccessibilityLabelAllowed: jest.fn(),
}));

describe('checkIsUppercase', () => {
    const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
        type: 'Text',
        viewId: 1,
        bounds: [0, 0, 100, 100],
        hasOnSubmitEditing: false,
        isAccessible: true,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Uppercase detection', () => {
        it('returns error when text is all uppercase', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'HELLO WORLD',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
                viewId: 1,
            });
        });

        it('returns null when text is lowercase', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'hello world',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns null when text is mixed case', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'Hello World',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns error for single uppercase letter', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'A',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('returns null for single lowercase letter', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'a',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns error for numbers and uppercase letters', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'HELLO123',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('returns error for symbols and uppercase letters', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'HELLO!',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('returns null for numbers only', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: '12345',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns null for symbols only', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: '!!!',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });
    });

    describe('AriaLabel vs Content priority', () => {
        it('prefers ariaLabel over content when both are present', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                ariaLabel: 'UPPERCASE LABEL',
                content: 'lowercase content',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('uses content when ariaLabel is not provided', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                ariaLabel: undefined,
                content: 'UPPERCASE CONTENT',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('returns null when ariaLabel is lowercase and content is uppercase', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                ariaLabel: 'lowercase label',
                content: 'UPPERCASE CONTENT',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });
    });

    describe('Empty text handling', () => {
        it('returns null for empty content when canBeEmpty is true (default)', () => {
            const node = createNode({
                content: '',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns null for undefined content when canBeEmpty is true', () => {
            const node = createNode({
                content: undefined,
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns null for whitespace-only content when canBeEmpty is true', () => {
            const node = createNode({
                content: '   ',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('returns null for empty content when canBeEmpty is false', () => {
            const node = createNode({
                content: '',
            });

            const result = checkIsUppercase({ node, canBeEmpty: false });
            expect(result).toBeNull();
        });

        it('returns null for whitespace-only content when canBeEmpty is false', () => {
            const node = createNode({
                content: '   ',
            });

            const result = checkIsUppercase({ node, canBeEmpty: false });
            expect(result).toBeNull();
        });
    });

    describe('Allowed exceptions', () => {
        it('returns null when text is allowed by isAccessibilityLabelAllowed', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(true);

            const node = createNode({
                content: 'ALLOWED EXCEPTION',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('calls isAccessibilityLabelAllowed with the correct text', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'TEST TEXT',
            });

            checkIsUppercase({ node });
            expect(isAccessibilityLabelAllowed).toHaveBeenCalledWith('TEST TEXT');
        });

        it('calls isAccessibilityLabelAllowed with ariaLabel when present', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                ariaLabel: 'ARIA LABEL',
                content: 'content',
            });

            checkIsUppercase({ node });
            expect(isAccessibilityLabelAllowed).toHaveBeenCalledWith('ARIA LABEL');
        });
    });

    describe('Custom rule parameter', () => {
        it('uses custom rule when provided', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'UPPERCASE',
            });

            const result = checkIsUppercase({ node, rule: 'CUSTOM_UPPERCASE_RULE' as AmaRule });
            expect(result).toMatchObject({
                rule: 'CUSTOM_UPPERCASE_RULE',
            });
        });

        it('uses default rule when not provided', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'UPPERCASE',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });
    });

    describe('Error structure', () => {
        it('includes ariaLabel in error when present', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'lowercase',
                ariaLabel: 'BUTTON LABEL',
            });

            const result = checkIsUppercase({ node });
            expect(result?.label).toBe('BUTTON LABEL');
        });

        it('includes viewId in error', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'UPPERCASE',
                viewId: 12345,
            });

            const result = checkIsUppercase({ node });
            expect(result?.viewId).toBe(12345);
        });

        it('includes undefined ariaLabel when not present', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'UPPERCASE',
                ariaLabel: undefined,
            });

            const result = checkIsUppercase({ node });
            expect(result?.label).toBeUndefined();
        });
    });

    describe('Edge cases', () => {
        it('returns error for uppercase with leading/trailing whitespace', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: '  UPPERCASE  ',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('handles unicode uppercase characters', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'ÀÉÎÖÜ',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });

        it('returns null for unicode lowercase characters', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'àéîöü',
            });

            const result = checkIsUppercase({ node });
            expect(result).toBeNull();
        });

        it('handles newlines in uppercase text', () => {
            const { isAccessibilityLabelAllowed } = require('../utils/isA11yLabelAllowed');
            isAccessibilityLabelAllowed.mockReturnValue(false);

            const node = createNode({
                content: 'HELLO\nWORLD',
            });

            const result = checkIsUppercase({ node });
            expect(result).toMatchObject({
                rule: 'NO_UPPERCASE_TEXT',
            });
        });
    });
});
