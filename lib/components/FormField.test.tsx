import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import * as UseFormField from '../hooks/useFormField';
import { FormField } from './FormField';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FormField', () => {
  it('register itself using useFormField', () => {
    const useFormField = jest.spyOn(UseFormField, 'useFormField');

    render(
      <FormField>
        <Text>Test</Text>
      </FormField>,
    );

    expect(useFormField).toHaveBeenCalledWith({
      hasFocusCallback: false,
      ref: expect.objectContaining({ current: expect.any(Object) }),
    });
  });

  it('wraps the children in a focusable View', () => {
    const { toJSON } = render(
      <FormField>
        <Text>Test</Text>
      </FormField>,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <Text
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
        Test
      </Text>
    `);
  });
});
