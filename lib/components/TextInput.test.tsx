import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import * as UseFormField from '../hooks/useFormField';
import { TextInput } from './TextInput';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TextInput', () => {
  beforeEach(() => {
    jest
      .spyOn(UseFormField, 'useFormField')
      // @ts-ignore
      .mockReturnValue({});
  });

  it('register itself as form field by using the useFormField hook', () => {
    const useFormField = jest
      .spyOn(UseFormField, 'useFormField')
      // @ts-ignore
      .mockReturnValue({});

    render(
      <TextInput
        label={<Text testID="text">Test</Text>}
        returnKeyType="done"
      />,
    );

    expect(useFormField).toHaveBeenCalledWith({
      hasFocusCallback: true,
      ref: expect.objectContaining({ current: expect.any(Object) }),
    });
  });

  it('renders the given label before the text input when labelPosition is undefined', () => {
    const renderAPI = render(
      <TextInput
        label={<Text testID="text">Label</Text>}
        returnKeyType="done"
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
          Label
        </Text>,
        <TextInput
          accessibilityLabel="Label"
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
        />,
      ]
    `);
  });

  it('renders the given label after the text input when labelPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        label={<Text testID="text"> Label after</Text>}
        labelPosition="afterInput"
        returnKeyType="done"
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <TextInput
          accessibilityLabel=" Label after"
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
        />,
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
           Label after
        </Text>,
      ]
    `);
  });

  it('hides the label from the screen readers', () => {
    const renderAPI = render(
      <TextInput
        label={<Text testID="text">Test</Text>}
        labelPosition="afterInput"
        returnKeyType="done"
      />,
    );

    expect(renderAPI.getByTestId('text').props.importantForAccessibility).toBe(
      'no',
    );
    expect(
      renderAPI.getByTestId('text').props.accessibilityElementsHidden,
    ).toBe(true);
  });

  describe('returnKeyType', () => {
    it('sets the `returnKeyType="next"` if more fields have been registered', async () => {
      const isLastField = jest.fn().mockReturnValue(false);

      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        isLastField,
      } as any);

      const renderAPI = render(
        <TextInput
          label={<Text testID="text">Label</Text>}
          labelPosition="afterInput"
          testID="test-id"
        />,
      );

      await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

      expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
        'next',
      );
    });

    it('sets the `returnKeyType="done"` if is last field registered', async () => {
      const isLastField = jest.fn().mockReturnValue(true);

      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        isLastField,
      } as any);

      const renderAPI = render(
        <TextInput
          label={<Text testID="text">Label</Text>}
          labelPosition="afterInput"
          testID="test-id"
        />,
      );

      await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

      expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
        'done',
      );
    });

    it.each([true, false])(
      'keeps the `returnKeyType` value passed as prop',
      async isLastFieldValue => {
        const isLastField = jest.fn().mockReturnValue(isLastFieldValue);

        jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
          isLastField,
        } as any);

        const renderAPI = render(
          <TextInput
            label={<Text testID="text">Label</Text>}
            labelPosition="afterInput"
            testID="test-id"
            returnKeyType="google"
          />,
        );

        await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

        expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
          'google',
        );
      },
    );
  });

  describe('accessibilityLabel', () => {
    describe('Given no accessibility label is provided', () => {
      it('Then applies the given label content as accessibilityLabel', () => {
        const renderAPI = render(
          <TextInput
            label={<Text>First name:</Text>}
            returnKeyType="done"
            testID="text-input"
          />,
        );

        expect(
          renderAPI.getByTestId('text-input').props.accessibilityLabel,
        ).toBe('First name:');
      });

      it('strips the ending * from the label content before using as accessibility label', () => {
        const renderAPI = render(
          <TextInput
            label={<Text>First name (required)*</Text>}
            returnKeyType="done"
            testID="text-input"
          />,
        );

        expect(
          renderAPI.getByTestId('text-input').props.accessibilityLabel,
        ).toBe('First name (required)');
      });
    });

    it('uses the accessibilityLabel only if provided', () => {
      const renderAPI = render(
        <TextInput
          label={<Text>First name (required)*</Text>}
          returnKeyType="done"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
        />,
      );

      expect(renderAPI.getByTestId('text-input').props.accessibilityLabel).toBe(
        'Please insert your first name',
      );
    });
  });

  it('calls focusNextFormField onSubmitEditing event', () => {
    const focusNextFormField = jest.fn();

    jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
      focusNextFormField,
    } as any);

    const fn = jest.fn();

    const renderAPI = render(
      <TextInput
        label={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        onSubmitEditing={fn}
      />,
    );

    fireEvent(
      renderAPI.getByTestId('text-input'),
      'onSubmitEditing',
      'whatever',
    );

    expect(fn).toHaveBeenCalledWith('whatever');
  });
});

jest.mock('../hooks/useFormField');
