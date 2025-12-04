import { Platform } from 'react-native';
import type { AmaNode } from '../../ReactNativeAma.types';
import { checkAriaRole } from './checkAriaRole';

describe('checkAriaRole', () => {
  const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
    type: 'Pressable',
    viewId: 1,
    bounds: [0, 0, 100, 100],
    hasOnSubmitEditing: false,
    ...overrides,
  });

  describe('Platform compatibility', () => {
    it('fails if the role is not supported by the platform (adjustable on Android)', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'adjustable',
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
        extra: '"adjustable" is not a native role for "android"',
        viewId: 1,
      });
    });

    it('passes for adjustable role on iOS', () => {
      Platform.OS = 'ios';

      const node = createNode({
        ariaRole: 'adjustable',
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('fails for checkbox role on iOS', () => {
      Platform.OS = 'ios';

      const node = createNode({
        ariaRole: 'checkbox',
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
        extra: '"checkbox" is not a native role for "ios"',
      });
    });

    it('passes for checkbox role on Android', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'checkbox',
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('fails for togglebutton role on iOS', () => {
      Platform.OS = 'ios';

      const node = createNode({
        ariaRole: 'togglebutton',
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
        extra: '"togglebutton" is not a native role for "ios"',
      });
    });

    it('passes for togglebutton role on Android', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'togglebutton',
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('fails for radio role on iOS', () => {
      Platform.OS = 'ios';

      const node = createNode({
        ariaRole: 'radio',
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
        extra: '"radio" is not a native role for "ios"',
      });
    });

    it('passes for radio role on Android', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'radio',
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });
  });

  describe('Cross-platform roles', () => {
    it.each(['ios', 'android'] as const)(
      'passes for button role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'button',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for switch role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'switch',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for tab role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'tab',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for link role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'link',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for search role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'search',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for header role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'header',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );

    it.each(['ios', 'android'] as const)(
      'passes for none role on %s',
      (platform) => {
        Platform.OS = platform;

        const node = createNode({
          ariaRole: 'none',
        });

        const result = checkAriaRole(node);
        expect(result).toBeNull();
      }
    );
  });

  describe('Missing or invalid roles', () => {
    it('fails when Pressable has no ariaRole and no traits', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: undefined,
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'NO_ACCESSIBILITY_ROLE',
        viewId: 1,
      });
    });

    it('fails when Pressable has empty ariaRole and no traits', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: '',
        traits: undefined,
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'NO_ACCESSIBILITY_ROLE',
        viewId: 1,
      });
    });

    it('fails when Pressable has empty ariaRole and empty traits', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: '',
        traits: [],
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'NO_ACCESSIBILITY_ROLE',
        viewId: 1,
      });
    });

    it('fails for unsupported role', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'unsupported-role',
      });

      const result = checkAriaRole(node);
      expect(result).toMatchObject({
        rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
        extra: '"unsupported-role" is not a native role for "android"',
      });
    });
  });

  describe('Traits handling', () => {
    it('uses traits when ariaRole is not provided', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: ['button'],
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('filters out "notEnabled" trait', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: ['button', 'notEnabled'],
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('filters out "selected" trait', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: ['button', 'selected'],
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('filters out both "notEnabled" and "selected" traits', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: ['button', 'notEnabled', 'selected'],
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('joins multiple traits together', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        traits: ['toggle', 'button'],
      });

      const result = checkAriaRole(node);
      // togglebutton is a valid Android role
      expect(result).toBeNull();
    });

    it('prefers ariaRole over traits when both are present', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'button',
        traits: ['adjustable'], // Would fail on Android
      });

      const result = checkAriaRole(node);
      // Should use ariaRole (button) which is valid
      expect(result).toBeNull();
    });
  });

  describe('Non-Pressable components', () => {
    it('returns null for Text components', () => {
      Platform.OS = 'android';

      const node = createNode({
        type: 'Text',
        ariaRole: undefined,
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('returns null for TextInput components', () => {
      Platform.OS = 'android';

      const node = createNode({
        type: 'TextInput',
        ariaRole: undefined,
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });

    it('returns null for Text components even with invalid role', () => {
      Platform.OS = 'android';

      const node = createNode({
        type: 'Text',
        ariaRole: 'adjustable', // iOS-only role
      });

      const result = checkAriaRole(node);
      expect(result).toBeNull();
    });
  });

  describe('Error structure', () => {
    it('includes ariaLabel in error when present', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        ariaLabel: 'Test button',
      });

      const result = checkAriaRole(node);
      expect(result?.label).toBe('Test button');
    });

    it('includes viewId in error', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: undefined,
        viewId: 12345,
      });

      const result = checkAriaRole(node);
      expect(result?.viewId).toBe(12345);
    });

    it('includes platform and role in incompatibility error', () => {
      Platform.OS = 'android';

      const node = createNode({
        ariaRole: 'adjustable',
      });

      const result = checkAriaRole(node);
      expect(result?.extra).toContain('adjustable');
      expect(result?.extra).toContain('android');
    });
  });
});
