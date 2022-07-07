import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { FormSubmit } from './FormSubmit';
import { Pressable } from './Pressable';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FormSubmit', () => {
  it('wraps the children inside a Pressable component with the correct accessibility role and label', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <FormSubmit
        accessibilityLabel="This is the label"
        busy={false}
        testID="test-me"
      />,
    );

    expect(UNSAFE_getByType(Pressable)).toBeTruthy();
    expect(getByTestId('test-me').props).toEqual(
      expect.objectContaining({
        accessibilityRole: 'button',
        accessibilityLabel: 'This is the label',
        accessibilityState: {
          busy: false,
        },
        busy: false,
        accessible: true,
      }),
    );
  });

  it('hides the children from the accessiblity tree', () => {
    const { getByTestId } = render(
      <FormSubmit
        accessibilityLabel="This is the label"
        busy={false}
        testID="test-me">
        <View testID="child" />
      </FormSubmit>,
    );

    expect(getByTestId('child').props).toEqual({
      accessibilityElementsHidden: true,
      children: null,
      importantForAccessibility: 'no',
      testID: 'child',
    });
  });
});
