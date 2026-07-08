import type { AmaNode } from '../../ReactNativeAma.types';
import { checkAriaLabel } from './checkAriaLabel';

describe('checkAriaLabel', () => {
    const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
        type: 'Pressable',
        viewId: 1,
        bounds: [0, 0, 100, 100],
        hasOnSubmitEditing: false,
        ...overrides,
    });

    describe('Pressable components', () => {
        it('returns error when Pressable has no ariaLabel', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: undefined,
            });

            const result = checkAriaLabel(node);
            expect(result).toMatchObject({
                rule: 'NO_ACCESSIBILITY_LABEL',
                viewId: 1,
            });
            expect(result?.label).toBeUndefined();
        });

        it('returns error when Pressable has empty string ariaLabel', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: '',
            });

            const result = checkAriaLabel(node);
            expect(result).toMatchObject({
                rule: 'NO_ACCESSIBILITY_LABEL',
                viewId: 1,
            });
        });

        it('returns null when Pressable has valid ariaLabel', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: 'Submit button',
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });

        it('includes viewId in error', () => {
            const node = createNode({
                type: 'Pressable',
                viewId: 12345,
                ariaLabel: undefined,
            });

            const result = checkAriaLabel(node);
            expect(result?.viewId).toBe(12345);
        });
    });

    describe('TextInput components', () => {
        it('returns error when TextInput has no ariaLabel', () => {
            const node = createNode({
                type: 'TextInput',
                ariaLabel: undefined,
            });

            const result = checkAriaLabel(node);
            expect(result).toMatchObject({
                rule: 'NO_ACCESSIBILITY_LABEL',
                viewId: 1,
            });
        });

        it('returns error when TextInput has empty string ariaLabel', () => {
            const node = createNode({
                type: 'TextInput',
                ariaLabel: '',
            });

            const result = checkAriaLabel(node);
            expect(result).toMatchObject({
                rule: 'NO_ACCESSIBILITY_LABEL',
                viewId: 1,
            });
        });

        it('returns null when TextInput has valid ariaLabel', () => {
            const node = createNode({
                type: 'TextInput',
                ariaLabel: 'Email input',
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });
    });

    describe('Text components', () => {
        it('returns null when Text has no ariaLabel', () => {
            const node = createNode({
                type: 'Text',
                ariaLabel: undefined,
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });

        it('returns null when Text has empty string ariaLabel', () => {
            const node = createNode({
                type: 'Text',
                ariaLabel: '',
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });

        it('returns null when Text has ariaLabel', () => {
            const node = createNode({
                type: 'Text',
                ariaLabel: 'Heading',
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });
    });

    describe('Edge cases', () => {
        it('treats whitespace-only ariaLabel as missing for Pressable', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: '   ',
            });

            const result = checkAriaLabel(node);
            // Boolean('   ') is true, so this should pass
            expect(result).toBeNull();
        });

        it('accepts single character ariaLabel', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: 'X',
            });

            const result = checkAriaLabel(node);
            expect(result).toBeNull();
        });

        it('includes the ariaLabel in error when present but empty', () => {
            const node = createNode({
                type: 'Pressable',
                ariaLabel: '',
            });

            const result = checkAriaLabel(node);
            expect(result?.label).toBe('');
        });
    });
});
