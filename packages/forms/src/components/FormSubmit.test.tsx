import { AMAProvider } from '@react-native-ama/core';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { act } from 'react-test-renderer';

import { Form } from './Form';
import { FormSubmit } from './FormSubmit';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FormSubmit', () => {
  it('wraps the children inside a Pressable component with the correct accessibility role and label', async () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <AMAProvider>
        <Form onSubmit={jest.fn()}>
          <FormSubmit
            accessibilityLabel="This is the label"
            busy={false}
            testID="test-me"
          />
        </Form>
      </AMAProvider>,
    );
    await act(() => {
      console.log(getByTestId('test-me').props);
      expect(UNSAFE_getByType(Pressable)).toBeTruthy();
      expect(getByTestId('test-me').props).toEqual(
        expect.objectContaining({
          accessibilityRole: 'button',
          accessibilityLabel: 'This is the label',
          accessibilityState: {
            busy: undefined,
            checked: undefined,
            disabled: undefined,
            expanded: undefined,
            selected: undefined,
          },
          busy: false,
          accessible: true,
        }),
      );
    });
  });

  it('hides the children from the accessibility tree', async () => {
    const { getByTestId } = render(
      <AMAProvider>
        <Form onSubmit={jest.fn()}>
          <FormSubmit
            accessibilityLabel="This is the label"
            busy={false}
            testID="test-me">
            <View testID="child" />
          </FormSubmit>
        </Form>
      </AMAProvider>,
    );
    await act(() => {
      expect(getByTestId('child').props).toEqual({
        accessibilityElementsHidden: true,
        children: null,
        importantForAccessibility: 'no',
        testID: 'child',
      });
    });
  });
});

jest.mock('../hooks/useFormField', () => {
  return {
    useFormField: jest.fn().mockReturnValue({}),
  };
});

jest.mock('@react-native-ama/core', () => {
  const originalModule = jest.requireActual('@react-native-ama/core');

  return {
    ...originalModule,
    useAMAContext: () => {
      return {
        isScreenReaderEnabled: true,
      };
    },
  };
});
