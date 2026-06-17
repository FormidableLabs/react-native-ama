import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';
import * as UseFormField from '../hooks/useFormField';
import { TextInput } from './TextInput';

beforeEach(() => {
  jest.clearAllMocks();
  (UseFormField.useFormField as jest.Mock).mockReturnValue({
    isLastField: jest.fn().mockReturnValue(false),
    focusNextFormField: jest.fn(),
  });
});

describe('TextInput', () => {
  it('renders the given renderLabel before the text input when labelPosition is undefined', () => {
    const renderAPI = render(
      <TextInput
        renderLabel={(a11yProps) => <Text {...a11yProps} testID="label">Label</Text>}
        accessibilityLabel="First name"
        hasValidation={false}
      />,
    );

    const json = renderAPI.toJSON() as any[];
    expect(json[0].props.testID).toBe('label');
    expect(json[0].props.importantForAccessibility).toBe('no-hide-descendants');
    expect(json[0].props.accessibilityElementsHidden).toBe(true);
  });

  it('renders the given renderLabel after the text input when labelPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        renderLabel={(a11yProps) => <Text {...a11yProps} testID="label">Label</Text>}
        accessibilityLabel="First name"
        labelPosition="afterInput"
        hasValidation={false}
      />,
    );

    const json = renderAPI.toJSON() as any[];
    expect(json[json.length - 1].props.testID).toBe('label');
  });

  it('renders the given renderError after the text input when errorPosition is "afterInput"', () => {
    const renderAPI = render(
      <TextInput
        renderLabel={(a11yProps) => <Text {...a11yProps}>Label</Text>}
        renderError={(a11yProps) => <Text {...a11yProps} testID="error">Error</Text>}
        accessibilityLabel="First name"
        hasValidation={true}
        hasError={true}
        errorPosition="afterInput"
      />,
    );

    const json = renderAPI.toJSON() as any[];
    expect(json[json.length - 1].props.testID).toBe('error');
  });

  it('renders the given renderError below the label when errorPosition is "belowLabel"', () => {
    const renderAPI = render(
      <TextInput
        renderLabel={(a11yProps) => <Text {...a11yProps} testID="label">Label</Text>}
        renderError={(a11yProps) => <Text {...a11yProps} testID="error">Error</Text>}
        accessibilityLabel="First name"
        hasValidation={true}
        hasError={true}
        errorPosition="belowLabel"
      />,
    );

    const json = renderAPI.toJSON() as any[];
    expect(json[0].props.testID).toBe('label');
    expect(json[1].props.testID).toBe('error');
  });

  it('does not render errorComponent when hasError is false', () => {
    const renderAPI = render(
      <TextInput
        renderLabel={(a11yProps) => <Text {...a11yProps}>Label</Text>}
        renderError={(a11yProps) => <Text {...a11yProps} testID="error">Error</Text>}
        accessibilityLabel="First name"
        hasValidation={true}
        hasError={false}
        errorPosition="afterInput"
      />,
    );

    expect(renderAPI.queryByTestId('error')).toBeNull();
  });

  describe('returnKeyType', () => {
    it('sets the `returnKeyType="next"` if more fields have been registered', async () => {
      (UseFormField.useFormField as jest.Mock).mockReturnValue({
        isLastField: jest.fn().mockReturnValue(false),
        focusNextFormField: jest.fn(),
      });

      const renderAPI = render(
        <TextInput
          accessibilityLabel="First name"
          testID="test-id"
          hasValidation={false}
        />,
      );

      await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

      expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
        'next',
      );
    });

    it('sets the `returnKeyType="done"` if is last field registered', async () => {
      (UseFormField.useFormField as jest.Mock).mockReturnValue({
        isLastField: jest.fn().mockReturnValue(true),
        focusNextFormField: jest.fn(),
      });

      const renderAPI = render(
        <TextInput
          accessibilityLabel="First name"
          testID="test-id"
          hasValidation={false}
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
        (UseFormField.useFormField as jest.Mock).mockReturnValue({
          isLastField: jest.fn().mockReturnValue(isLastFieldValue),
          focusNextFormField: jest.fn(),
        });

        const renderAPI = render(
          <TextInput
            accessibilityLabel="First name"
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

  it('uses the accessibilityLabel prop', () => {
    const renderAPI = render(
      <TextInput
        accessibilityLabel="Please insert your first name"
        testID="text-input"
        hasValidation={false}
      />,
    );

    expect(renderAPI.getByTestId('text-input').props.accessibilityLabel).toBe(
      'Please insert your first name',
    );
  });

  it('calls focusNextFormField onSubmitEditing event', () => {
    const focusNextFormField = jest.fn();

    (UseFormField.useFormField as jest.Mock).mockReturnValue({
      focusNextFormField,
      isLastField: jest.fn().mockReturnValue(false),
    });

    const fn = jest.fn();

    const renderAPI = render(
      <TextInput
        accessibilityLabel="Please insert your first name"
        returnKeyType="next"
        testID="text-input"
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
    expect(focusNextFormField).toHaveBeenCalledWith();
  });
});

jest.mock('../hooks/useFormField', () => ({
  useFormField: jest.fn(() => ({
    isLastField: jest.fn().mockReturnValue(false),
    focusNextFormField: jest.fn(),
  })),
}));
