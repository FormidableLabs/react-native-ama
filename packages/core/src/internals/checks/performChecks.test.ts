import type { AmaNode } from '../../ReactNativeAma.types';
import { checkTextInputs } from './performChecks';

describe('checkTextInputs', () => {
    const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
        type: 'Pressable',
        viewId: 1,
        bounds: [0, 0, 100, 100],
        hasOnSubmitEditing: false,
        ...overrides,
    });

    describe('Label is focusable', () => {
        it('reports INPUT_HAS_FOCUSABLE_LABEL when Text node matches aria-label and is accessible', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'Text',
                    viewId: 2,
                    content: 'Email',
                    isAccessible: true,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result).toContainEqual({
                rule: 'INPUT_HAS_FOCUSABLE_LABEL',
                viewId: 2,
            });
        });

        it('does not report INPUT_HAS_FOCUSABLE_LABEL when Text node is not accessible', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'Text',
                    viewId: 2,
                    content: 'Email',
                    isAccessible: false,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result.find(e => e.rule === 'INPUT_HAS_FOCUSABLE_LABEL')).toBeUndefined();
        });

        it('does not report INPUT_HAS_FOCUSABLE_LABEL when matching Text node is missing', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    isAccessible: undefined,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result.find(e => e.rule === 'INPUT_HAS_FOCUSABLE_LABEL')).toBeUndefined();
        });

        it('strips trailing punctuation when matching label text', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Name:',
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'Text',
                    viewId: 2,
                    content: 'Name',
                    isAccessible: true,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result).toContainEqual({
                rule: 'INPUT_HAS_FOCUSABLE_LABEL',
                viewId: 2,
            });
        });

        it('performs case-insensitive matching', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'EMAIL:',
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'Text',
                    viewId: 2,
                    content: 'email',
                    isAccessible: true,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result).toContainEqual({
                rule: 'INPUT_HAS_FOCUSABLE_LABEL',
                viewId: 2,
            });
        });
    });

    describe('Missing visible label', () => {
        it('reports INPUT_HAS_NO_VISIBLE_LABEL when aria-label is set but no matching Text node', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    isAccessible: undefined,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result).toContainEqual({
                rule: 'INPUT_HAS_NO_VISIBLE_LABEL',
                viewId: 1,
            });
        });

        it('does not report INPUT_HAS_NO_VISIBLE_LABEL when no aria-label is set', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: undefined,
                    isAccessible: undefined,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result.find(e => e.rule === 'INPUT_HAS_NO_VISIBLE_LABEL')).toBeUndefined();
        });

        it('does not report INPUT_HAS_NO_VISIBLE_LABEL when matching Text node exists', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'Text',
                    viewId: 2,
                    content: 'Email',
                    isAccessible: false,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result.find(e => e.rule === 'INPUT_HAS_NO_VISIBLE_LABEL')).toBeUndefined();
        });
    });

    describe('Invalid return key', () => {
        it('reports INPUT_INVALID_RETURN_KEY for non-last input with returnType RETURN_DONE', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    returnType: 0, // RETURN_DONE = 0
                    isAccessible: undefined,
                }),
                createNode({
                    type: 'TextInput',
                    viewId: 2,
                    ariaLabel: 'Password:',
                    returnType: 1,
                    isAccessible: undefined,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result).toContainEqual({
                rule: 'INPUT_INVALID_RETURN_KEY',
                viewId: 1,
            });
        });

        it('does not report INPUT_INVALID_RETURN_KEY for last input with returnType RETURN_DONE', () => {
            const nodes: AmaNode[] = [
                createNode({
                    type: 'TextInput',
                    viewId: 1,
                    ariaLabel: 'Email:',
                    returnType: 0, // RETURN_DONE = 0
                    isAccessible: undefined,
                }),
            ];

            const result = checkTextInputs(nodes);
            expect(result.find(e => e.rule === 'INPUT_INVALID_RETURN_KEY')).toBeUndefined();
        });
    });
});
