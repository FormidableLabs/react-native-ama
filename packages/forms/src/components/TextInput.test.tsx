import * as UseChecks from '@react-native-ama/core/src/hooks/useChecks';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';
import { ERROR_STYLE } from '~internal';

import * as UseFormField from '../hooks/useFormField';
import { TextInput } from './TextInput';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TextInput', () => {
  it('register itself as form field by using the useFormField hook', () => {
    const useFormField = jest.spyOn(UseFormField, 'useFormField');

    render(
      <TextInput
        labelComponent={<Text testID="text">Test</Text>}
        hasValidation={false}
        returnKeyType="done"
      />,
    );

    expect(useFormField.mock.calls[0][0]).toMatchObject({
      ref: expect.objectContaining({ current: expect.any(Object) }),
      errorMessage: undefined,
      hasError: undefined,
      hasValidation: false,
      id: undefined,
      nextFieldId: undefined,
      nextFormFieldRef: undefined,
    });
  });

  it('renders the given labelComponent before the text input when labelPosition is undefined', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text testID="text">labelComponent</Text>}
        returnKeyType="done"
        hasValidation={false}
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
          labelComponent
        </Text>,
        <TextInput
          accessibilityHint=""
          accessibilityLabel="labelComponent"
          hasValidation={false}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={Object {}}
        />,
      ]
    `);
  });

  it('renders the given labelComponent after the text input when labelPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text testID="text"> labelComponent after</Text>}
        labelPosition="afterInput"
        returnKeyType="done"
        hasValidation={false}
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <TextInput
          accessibilityHint=""
          accessibilityLabel=" labelComponent after"
          hasValidation={false}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={Object {}}
        />,
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
           labelComponent after
        </Text>,
      ]
    `);
  });

  it('renders the given errorComponent after the labelComponent when errorPosition is "belowLabel"', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text testID="text">the labelComponent</Text>}
        returnKeyType="done"
        hasValidation={true}
        errorComponent={<Text>This is the errorComponent</Text>}
        errorPosition="belowLabel"
        hasError={true}
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
          the labelComponent
        </Text>,
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          This is the errorComponent
        </Text>,
        <TextInput
          accessibilityHint="This is the errorComponent"
          accessibilityLabel="the labelComponent"
          hasError={true}
          hasValidation={true}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={Object {}}
        />,
      ]
    `);
  });

  it('renders the given errorComponent after the input when errorPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text testID="text">the labelComponent</Text>}
        returnKeyType="done"
        hasValidation={true}
        errorComponent={<Text>This is the errorComponent</Text>}
        errorPosition="afterInput"
        hasError={true}
      />,
    );

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      Array [
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
          testID="text"
        >
          the labelComponent
        </Text>,
        <TextInput
          accessibilityHint="This is the errorComponent"
          accessibilityLabel="the labelComponent"
          hasError={true}
          hasValidation={true}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={Object {}}
        />,
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          This is the errorComponent
        </Text>,
      ]
    `);
  });

  it('hides the labelComponent from the screen readers', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text testID="text">Test</Text>}
        labelPosition="afterInput"
        returnKeyType="done"
        hasValidation={false}
      />,
    );

    expect(renderAPI.getByTestId('text').props.importantForAccessibility).toBe(
      'no',
    );
    expect(
      renderAPI.getByTestId('text').props.accessibilityElementsHidden,
    ).toBe(true);
  });

  it('hides the errorComponent component from the screen readers', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text>Test</Text>}
        labelPosition="afterInput"
        returnKeyType="done"
        hasValidation={true}
        errorComponent={
          <Text testID="errorComponent-test-id">
            This is the errorComponent
          </Text>
        }
        errorPosition="afterInput"
        hasError={true}
      />,
    );

    expect(
      renderAPI.getByTestId('errorComponent-test-id').props
        .importantForAccessibility,
    ).toBe('no');
    expect(
      renderAPI.getByTestId('errorComponent-test-id').props
        .accessibilityElementsHidden,
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
          labelComponent={<Text testID="text">labelComponent</Text>}
          labelPosition="afterInput"
          testID="test-id"
          hasValidation={false}
        />,
      );

      await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

      expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
        'next',
      );
    });

    it('sets the `returnKeyType="done"` if is last field registered', () => {
      const isLastField = jest.fn().mockReturnValue(true);

      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        isLastField,
      } as any);

      const renderAPI = render(
        <TextInput
          labelComponent={<Text testID="text">labelComponent</Text>}
          labelPosition="afterInput"
          testID="test-id"
          hasValidation={false}
        />,
      );

      fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

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
            labelComponent={<Text testID="text">labelComponent</Text>}
            labelPosition="afterInput"
            testID="test-id"
            returnKeyType="google"
            hasValidation={false}
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
    describe('Given no accessibility labelComponent is provided', () => {
      it('Then applies the given labelComponent content as accessibilityLabel', () => {
        const renderAPI = render(
          <TextInput
            labelComponent={<Text>First name:</Text>}
            returnKeyType="done"
            testID="text-input"
            hasValidation={false}
          />,
        );

        expect(
          renderAPI.getByTestId('text-input').props.accessibilityLabel,
        ).toBe('First name:');
      });

      it('strips the ending * from the labelComponent content before using as accessibility labelComponent', () => {
        const renderAPI = render(
          <TextInput
            labelComponent={<Text>First name (required)*</Text>}
            returnKeyType="done"
            testID="text-input"
            hasValidation={false}
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
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="done"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          hasValidation={false}
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
        labelComponent={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        onSubmitEditing={fn}
        hasValidation={false}
      />,
    );

    fireEvent(
      renderAPI.getByTestId('text-input'),
      'onSubmitEditing',
      'whatever',
    );

    expect(fn).toHaveBeenCalledWith('whatever');
  });

  it('ignores the errorComponent message if hasError is not true', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        hasValidation={true}
        hasError={false}
        errorMessage={'This is the errorComponent'}
        errorComponent={<></>}
      />,
    );

    expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
      '',
    );
  });

  it('when hasError uses the text from the errorComponent as part of the accessibilityHint', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        accessibilityHint="The hint"
        hasValidation={true}
        hasError={true}
        errorComponent={<Text>The first name cannot be blank</Text>}
      />,
    );

    expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
      'The hint, The first name cannot be blank',
    );
  });

  it('when hasError uses the errorText, if specified, as part of the accessibilityHint', () => {
    const renderAPI = render(
      <TextInput
        labelComponent={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        accessibilityHint="The hint"
        hasValidation={true}
        hasError={true}
        errorMessage="This text will be used"
        errorComponent={<Text>The first name cannot be blank</Text>}
      />,
    );

    expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
      'The hint, This text will be used',
    );
  });

  it('apply the style returned by useFormField', () => {
    const focusNextFormField = jest.fn();

    jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
      focusNextFormField,
      style: ERROR_STYLE,
    } as any);

    const renderAPI = render(
      <TextInput
        labelComponent={<Text>First name (required)*</Text>}
        returnKeyType="next"
        testID="text-input"
        accessibilityLabel="Please insert your first name"
        hasValidation={false}
      />,
    );

    expect(renderAPI.getByTestId('text-input').props.style).toEqual(
      ERROR_STYLE,
    );
  });

  describe('When __DEV__ is false', () => {
    let TextInputWithoutDev: typeof TextInput;
    let accessibilityLabelChecker: jest.Mock;
    let uppercaseChecker: jest.Mock;
    let onLayout: jest.Mock;
    let noUndefinedProperty: jest.Mock;

    beforeEach(function () {
      // @ts-ignore
      global.__DEV__ = false;

      accessibilityLabelChecker = jest.fn();
      noUndefinedProperty = jest.fn();
      uppercaseChecker = jest.fn();
      onLayout = jest.fn();

      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        noUppercaseStringChecker: accessibilityLabelChecker,
        noUndefinedProperty,
        uppercaseChecker,
        onLayout,
      } as any);

      TextInputWithoutDev = require('./TextInput').TextInput;
    });

    it('does not perform any check', () => {
      render(
        <TextInputWithoutDev
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          hasValidation={false}
        />,
      );

      expect(noUndefinedProperty).not.toHaveBeenCalled();
    });

    it('does not apply the debug style', () => {
      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        style: ERROR_STYLE,
      } as any);

      const { getByTestId } = render(
        <TextInputWithoutDev
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          hasValidation={false}
        />,
      );

      expect(getByTestId('text-input').props.style).toEqual(undefined);
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
