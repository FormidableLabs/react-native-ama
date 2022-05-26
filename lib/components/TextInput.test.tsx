import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import * as CheckFocusTrap from '../internal/checkFocusTrap';
import * as Logger from '../internal/logger';
import { TextInput } from './TextInput';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TextInput', () => {
  it('logs the error if no label is specified', () => {
    const log = jest.spyOn(Logger, 'log');

    render(
      // @ts-ignore
      <TextInput />,
    );

    expect(log).toHaveBeenCalledWith(
      'NO_UNDEFINED',
      'The property "label" cannot be UNDEFINED',
    );
  });

  it('renders the given label before the text input when labelPosition is undefined', () => {
    const renderAPI = render(
      <TextInput label={<Text testID="text" />} returnKeyType="done" />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        />,
        <TextInput
          accessibilityLabel=""
          allowFontScaling={true}
          onSubmitEditing={[Function]}
          rejectResponderTermination={true}
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />,
      ]
    `);
  });

  it('renders the given label after the text input when labelPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        label={<Text testID="text" />}
        labelPosition="afterInput"
        returnKeyType="done"
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <TextInput
          accessibilityLabel=""
          allowFontScaling={true}
          onSubmitEditing={[Function]}
          rejectResponderTermination={true}
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />,
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        />,
      ]
    `);
  });

  it('hides the label from the screen readers', () => {
    const renderAPI = render(
      <TextInput
        label={<Text testID="text" />}
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

  it('focus the next element and checks for focus trap onSubmitEditing event', () => {
    const checkFocusTrap = jest.spyOn(CheckFocusTrap, 'checkFocusTrap');

    const fn = jest.fn();
    const focus = jest.fn();
    const fakeRef = { current: 'hello', focus };

    const renderAPI = render(
      <TextInput
        label={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        onSubmitEditing={fn}
        nextTextInput={fakeRef as any}
      />,
    );

    fireEvent(
      renderAPI.getByTestId('text-input'),
      'onSubmitEditing',
      'whatever',
    );

    expect(fn).toHaveBeenCalledWith('whatever');
    expect(focus).toHaveBeenCalledWith();
    expect(checkFocusTrap).toHaveBeenCalledWith(fakeRef);
  });
});

jest.mock('../internal/checkFocusTrap');
jest.mock('../internal/logger');
