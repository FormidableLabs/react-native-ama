import type { AmaNode } from '../../ReactNativeAma.types';
import { checkImageAlt } from './checkImageAlt';

describe('checkImageAlt', () => {
    const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
        type: 'Image',
        viewId: 1,
        bounds: [0, 0, 100, 100],
        hasOnSubmitEditing: false,
        ...overrides,
    });

    describe('Image components with missing alt text', () => {
        it('returns error when Image has no ariaLabel', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: undefined,
                isAccessible: true,
            });

            const result = checkImageAlt(node);
            expect(result).toMatchObject({
                rule: 'IMAGE_MISSING_ALT_TEXT',
                viewId: 1,
            });
        });

        it('returns error when Image has empty string ariaLabel', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: '',
                isAccessible: true,
            });

            const result = checkImageAlt(node);
            expect(result).toMatchObject({
                rule: 'IMAGE_MISSING_ALT_TEXT',
                viewId: 1,
            });
        });

        it('returns error when Image has no isAccessible prop (defaults to accessible)', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: undefined,
            });

            const result = checkImageAlt(node);
            expect(result).toMatchObject({
                rule: 'IMAGE_MISSING_ALT_TEXT',
                viewId: 1,
            });
        });
    });

    describe('Image components with valid alt text', () => {
        it('returns null when Image has valid ariaLabel', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: 'Product photo',
                isAccessible: true,
            });

            const result = checkImageAlt(node);
            expect(result).toBeNull();
        });

        it('returns null when Image has descriptive ariaLabel', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: 'Icon for settings menu',
            });

            const result = checkImageAlt(node);
            expect(result).toBeNull();
        });
    });

    describe('Non-accessible images', () => {
        it('returns null when Image is marked non-accessible (decorative)', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: undefined,
                isAccessible: false,
            });

            const result = checkImageAlt(node);
            expect(result).toBeNull();
        });

        it('returns null when decorative image with empty ariaLabel', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: '',
                isAccessible: false,
            });

            const result = checkImageAlt(node);
            expect(result).toBeNull();
        });
    });

    describe('Error details', () => {
        it('includes correct viewId in error', () => {
            const node = createNode({
                type: 'Image',
                viewId: 99999,
                ariaLabel: undefined,
            });

            const result = checkImageAlt(node);
            expect(result?.viewId).toBe(99999);
        });

        it('includes correct rule in error', () => {
            const node = createNode({
                type: 'Image',
                ariaLabel: undefined,
            });

            const result = checkImageAlt(node);
            expect(result?.rule).toBe('IMAGE_MISSING_ALT_TEXT');
        });
    });
});
