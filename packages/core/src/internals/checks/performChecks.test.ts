import type { AmaNode } from '../../ReactNativeAma.types';
import { checkTextInputs } from './checkTextInput';
import { performChecks } from './performChecks';

jest.mock('../utils/isRuleDisabled', () => ({
  isRuleDisabled: jest.fn(() => false),
}));

jest.mock('../utils/getRuleAction', () => ({
  getRuleAction: jest.fn(() => 'PLEASE_FORGIVE_ME'),
}));

jest.mock('../utils/ignoreContrastCheck', () => ({
  shouldIgnoreContrastCheckForDisabledElement: jest.fn(() => false),
}));

beforeEach(() => {
  jest.clearAllMocks();
  const { isRuleDisabled } = require('../utils/isRuleDisabled');
  isRuleDisabled.mockReturnValue(false);
  const { getRuleAction } = require('../utils/getRuleAction');
  getRuleAction.mockReturnValue('PLEASE_FORGIVE_ME');
});

const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
  type: 'Pressable',
  viewId: 1,
  bounds: [100, 100, 0, 0],
  hasOnSubmitEditing: false,
  ...overrides,
});

describe('checkTextInputs', () => {
  describe('Label is focusable', () => {
    it('reports INPUT_HAS_FOCUSABLE_LABEL when Text node matches aria-label and is accessible', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
        createNode({ type: 'Text', viewId: 2, content: 'Email', isAccessible: true }),
      ];

      const result = checkTextInputs(nodes);
      expect(result).toContainEqual({ rule: 'INPUT_HAS_FOCUSABLE_LABEL', viewId: 2 });
    });

    it('does not report INPUT_HAS_FOCUSABLE_LABEL when Text node is not accessible', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
        createNode({ type: 'Text', viewId: 2, content: 'Email', isAccessible: false }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_HAS_FOCUSABLE_LABEL')).toBeUndefined();
    });

    it('does not report INPUT_HAS_FOCUSABLE_LABEL when matching Text node is missing', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_HAS_FOCUSABLE_LABEL')).toBeUndefined();
    });

    it('strips trailing punctuation when matching label text', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Name:', isAccessible: undefined }),
        createNode({ type: 'Text', viewId: 2, content: 'Name', isAccessible: true }),
      ];

      const result = checkTextInputs(nodes);
      expect(result).toContainEqual({ rule: 'INPUT_HAS_FOCUSABLE_LABEL', viewId: 2 });
    });

    it('performs case-insensitive matching', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'EMAIL:', isAccessible: undefined }),
        createNode({ type: 'Text', viewId: 2, content: 'email', isAccessible: true }),
      ];

      const result = checkTextInputs(nodes);
      expect(result).toContainEqual({ rule: 'INPUT_HAS_FOCUSABLE_LABEL', viewId: 2 });
    });
  });

  describe('Missing visible label', () => {
    it('reports INPUT_HAS_NO_VISIBLE_LABEL when aria-label is set but no matching Text node', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result).toContainEqual({ rule: 'INPUT_HAS_NO_VISIBLE_LABEL', viewId: 1 });
    });

    it('does not report INPUT_HAS_NO_VISIBLE_LABEL when no aria-label is set', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: undefined, isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_HAS_NO_VISIBLE_LABEL')).toBeUndefined();
    });

    it('does not report INPUT_HAS_NO_VISIBLE_LABEL when matching Text node exists', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
        createNode({ type: 'Text', viewId: 2, content: 'Email', isAccessible: false }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_HAS_NO_VISIBLE_LABEL')).toBeUndefined();
    });
  });

  describe('Invalid return key', () => {
    it('reports INPUT_INVALID_RETURN_KEY for non-last input with returnType RETURN_DONE', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', returnType: 0, isAccessible: undefined }),
        createNode({ type: 'TextInput', viewId: 2, ariaLabel: 'Password:', returnType: 1, isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result).toContainEqual({ rule: 'INPUT_INVALID_RETURN_KEY', viewId: 1 });
    });

    it('does not report INPUT_INVALID_RETURN_KEY for last input with returnType RETURN_DONE', () => {
      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', returnType: 0, isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_INVALID_RETURN_KEY')).toBeUndefined();
    });
  });

  describe('Rule disable via config', () => {
    it('filters out disabled rules from checkTextInputs results', () => {
      const { isRuleDisabled } = require('../utils/isRuleDisabled');
      isRuleDisabled.mockImplementation((error: { rule: string }) =>
        error.rule === 'INPUT_HAS_NO_VISIBLE_LABEL',
      );

      const nodes: AmaNode[] = [
        createNode({ type: 'TextInput', viewId: 1, ariaLabel: 'Email:', isAccessible: undefined }),
      ];

      const result = checkTextInputs(nodes);
      expect(result.find(e => e.rule === 'INPUT_HAS_NO_VISIBLE_LABEL')).toBeUndefined();
    });

    it('filters out disabled rules from performChecks results', () => {
      const { isRuleDisabled } = require('../utils/isRuleDisabled');
      isRuleDisabled.mockImplementation((error: { rule: string }) =>
        error.rule === 'NO_ACCESSIBILITY_LABEL',
      );

      const node = createNode({ type: 'Pressable', ariaLabel: undefined, isAccessible: true });
      const result = performChecks(node);
      expect(result.find(e => e.rule === 'NO_ACCESSIBILITY_LABEL')).toBeUndefined();
    });

    it('includes enabled rules in performChecks results', () => {
      const { isRuleDisabled } = require('../utils/isRuleDisabled');
      isRuleDisabled.mockReturnValue(false);

      const node = createNode({ type: 'Pressable', ariaLabel: undefined, isAccessible: true });
      const result = performChecks(node);
      expect(result.find(e => e.rule === 'NO_ACCESSIBILITY_LABEL')).toBeDefined();
    });
  });
});
