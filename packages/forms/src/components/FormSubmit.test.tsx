import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable } from 'react-native';
import { FormSubmit } from './FormSubmit';
import * as Form from './Form';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FormSubmit', () => {
  it('provides onPress to its children render function', () => {
    const submitForm = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(Form, 'useForm').mockImplementation(
      () => ({ submitForm }) as any,
    );

    const renderChildren = jest.fn(({ onPress }) => (
      <Pressable testID="submit" onPress={onPress} />
    ));

    const { getByTestId, UNSAFE_getAllByType } = render(
      <FormSubmit>{renderChildren}</FormSubmit>,
    );

    expect(renderChildren).toHaveBeenCalledTimes(1);
    expect(UNSAFE_getAllByType(Pressable)).toHaveLength(1);

    fireEvent.press(getByTestId('submit'));

    expect(submitForm).toHaveBeenCalledTimes(1);
  });
});
