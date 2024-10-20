import { AMAProvider } from '@react-native-ama/core';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';
import { act } from 'react-test-renderer';

import * as UseFormField from '../hooks/useFormField';
import { Form } from './Form';
import { FormField } from './FormField';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FormField', () => {
  it('register itself using useFormField', async () => {
    const useFormField = jest.spyOn(UseFormField, 'useFormField');

    render(
      <AMAProvider>
        <Form onSubmit={jest.fn()}>
          <FormField hasValidation={false}>
            <Text>Test</Text>
          </FormField>
        </Form>
      </AMAProvider>,
    );
    await act(() => {
      expect(useFormField.mock.calls[0][0]).toMatchObject({
        hasFocusCallback: false,
        ref: expect.objectContaining({ current: expect.any(Object) }),
      });
    });
  });

  it('wraps the children in a focusable View', async () => {
    const { toJSON } = render(
      <AMAProvider>
        <Form onSubmit={jest.fn()}>
          <FormField hasValidation={false}>
            <Text>Test</Text>
          </FormField>
        </Form>
      </AMAProvider>,
    );
    await act(() => {
      expect(toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <View
          accessibilityHint=""
          accessibilityState={
            {
              "busy": undefined,
              "checked": undefined,
              "disabled": undefined,
              "expanded": undefined,
              "selected": undefined,
            }
          }
          accessible={true}
          focusable={false}
          onClick={[Function]}
          onResponderGrant={[Function]}
          onResponderMove={[Function]}
          onResponderRelease={[Function]}
          onResponderTerminate={[Function]}
          onResponderTerminationRequest={[Function]}
          onStartShouldSetResponder={[Function]}
        >
          <Text>
            Test
          </Text>
        </View>
      </View>
    `);
    });
  });
});
