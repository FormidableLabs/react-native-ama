import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';
import * as UseFormField from '../hooks/useFormField';
import { FormField } from './FormField';

jest.mock('../hooks/useFormField', () => ({
  useFormField: jest.fn(() => ({})),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (UseFormField.useFormField as jest.Mock).mockReturnValue({});
});

describe('FormField', () => {
  it('register itself using useFormField', () => {
    const useFormField = jest.spyOn(UseFormField, 'useFormField');

    render(
      <FormField hasValidation={false}>
        <Text>Test</Text>
      </FormField>,
    );

    expect(useFormField.mock.calls[0][0]).toMatchObject({
      hasFocusCallback: false,
      ref: expect.objectContaining({ current: expect.any(Object) }),
    });
  });

  it('wraps the children in a focusable View', () => {
    const { toJSON } = render(
      <FormField hasValidation={false}>
        <Text>Test</Text>
      </FormField>,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <TouchableWithoutFeedback
        hasValidation={false}
        ref={
          {
            "current": null,
          }
        }
      >
        <View
          accessible={true}
        >
          <Text>
            Test
          </Text>
        </View>
      </TouchableWithoutFeedback>
    `);
  });
});
