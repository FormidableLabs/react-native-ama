import { AMAProvider, useChecks } from '@react-native-ama/core';
import { ERROR_STYLE } from '@react-native-ama/internal';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';
import { act } from 'react-test-renderer';

import * as UseFormField from '../hooks/useFormField';
import { TextInput } from './TextInput';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TextInput', () => {
  it('register itself as form field by using the useFormField hook', async () => {
    const useFormField = jest.spyOn(UseFormField, 'useFormField');

    render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text">Test</Text>}
          hasValidation={false}
          returnKeyType="done"
        />
      </AMAProvider>,
    );
    await act(() => {
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
  });

  it('renders the given labelComponent before the text input when labelPosition is undefined', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text">labelComponent</Text>}
          returnKeyType="done"
          hasValidation={false}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <Text
          testID="text"
        >
          labelComponent
        </Text>
        <TextInput
          accessibilityHint=""
          accessibilityLabel="labelComponent"
          blurOnSubmit={true}
          hasValidation={false}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={{}}
        />
      </View>
    `);
    });
  });

  it('renders the given labelComponent after the text input when labelPosition is "afterInput"', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text"> labelComponent after</Text>}
          labelPosition="afterInput"
          returnKeyType="done"
          hasValidation={false}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <TextInput
          accessibilityHint=""
          accessibilityLabel=" labelComponent after"
          blurOnSubmit={true}
          hasValidation={false}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={{}}
        />
        <Text
          testID="text"
        >
           labelComponent after
        </Text>
      </View>
    `);
    });
  });

  it('renders the given errorComponent after the labelComponent when errorPosition is "belowLabel"', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text">the labelComponent</Text>}
          returnKeyType="done"
          hasValidation={true}
          errorComponent={<Text>This is the errorComponent</Text>}
          errorPosition="belowLabel"
          hasError={true}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <Text
          testID="text"
        >
          the labelComponent
        </Text>
        <Text>
          This is the errorComponent
        </Text>
        <TextInput
          accessibilityHint="This is the errorComponent"
          accessibilityLabel="the labelComponent"
          blurOnSubmit={true}
          hasError={true}
          hasValidation={true}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={{}}
        />
      </View>
    `);
    });
  });

  it('renders the given errorComponent after the input when errorPosition is "afterInput"', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text">the labelComponent</Text>}
          returnKeyType="done"
          hasValidation={true}
          errorComponent={<Text>This is the errorComponent</Text>}
          errorPosition="afterInput"
          hasError={true}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <Text
          testID="text"
        >
          the labelComponent
        </Text>
        <TextInput
          accessibilityHint="This is the errorComponent"
          accessibilityLabel="the labelComponent"
          blurOnSubmit={true}
          hasError={true}
          hasValidation={true}
          onLayout={[Function]}
          onSubmitEditing={[Function]}
          returnKeyType="done"
          style={{}}
        />
        <Text>
          This is the errorComponent
        </Text>
      </View>
    `);
    });
  });

  it('hides the labelComponent from the screen readers', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text testID="text">Test</Text>}
          labelPosition="afterInput"
          returnKeyType="done"
          hasValidation={false}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(
        renderAPI.getByTestId('text').props.importantForAccessibility,
      ).toBe('no');
      expect(
        renderAPI.getByTestId('text').props.accessibilityElementsHidden,
      ).toBe(true);
    });
  });

  it('hides the errorComponent component from the screen readers', async () => {
    const renderAPI = render(
      <AMAProvider>
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
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(
        renderAPI.getByTestId('errorComponent-test-id').props
          .importantForAccessibility,
      ).toBe('no');
      expect(
        renderAPI.getByTestId('errorComponent-test-id').props
          .accessibilityElementsHidden,
      ).toBe(true);
    });
  });

  describe('returnKeyType', () => {
    it('sets the `returnKeyType="next"` if more fields have been registered', async () => {
      const isLastField = jest.fn().mockReturnValue(false);

      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        isLastField,
      } as any);

      const renderAPI = render(
        <AMAProvider>
          <TextInput
            labelComponent={<Text testID="text">labelComponent</Text>}
            labelPosition="afterInput"
            testID="test-id"
            hasValidation={false}
          />
        </AMAProvider>,
      );

      await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');
      await act(() => {
        expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
          'next',
        );
      })
    });

    it('sets the `returnKeyType="done"` if is last field registered', async () => {
      const isLastField = jest.fn().mockReturnValue(true);

      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        isLastField,
      } as any);

      const renderAPI = render(
        <AMAProvider>
          <TextInput
            labelComponent={<Text testID="text">labelComponent</Text>}
            labelPosition="afterInput"
            testID="test-id"
            hasValidation={false}
          />
        </AMAProvider>,
      );

      fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');
      await act(() => {
        expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
          'done',
        );
      })
    });

    it.each([true, false])(
      'keeps the `returnKeyType` value passed as prop',
      async isLastFieldValue => {
        const isLastField = jest.fn().mockReturnValue(isLastFieldValue);

        jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
          isLastField,
        } as any);

        const renderAPI = render(
          <AMAProvider>
            <TextInput
              labelComponent={<Text testID="text">labelComponent</Text>}
              labelPosition="afterInput"
              testID="test-id"
              returnKeyType="google"
              hasValidation={false}
            />
          </AMAProvider>,
        );

        await fireEvent(renderAPI.getByTestId('test-id'), 'onLayout');

        await act(() => {
          expect(renderAPI.getByTestId('test-id').props.returnKeyType).toEqual(
            'google',
          );
        })
      },
    );
  });

  describe('accessibilityLabel', () => {
    describe('Given no accessibility labelComponent is provided', () => {
      it('Then applies the given labelComponent content as accessibilityLabel', async () => {
        const renderAPI = render(
          <AMAProvider>
            <TextInput
              labelComponent={<Text>First name:</Text>}
              returnKeyType="done"
              testID="text-input"
              hasValidation={false}
            />
          </AMAProvider>,
        );
        await act(() => {
          expect(
            renderAPI.getByTestId('text-input').props.accessibilityLabel,
          ).toBe('First name:');
        });
      });

      it('strips the ending * from the labelComponent content before using as accessibility labelComponent', async () => {
        const renderAPI = render(
          <AMAProvider>
            <TextInput
              labelComponent={<Text>First name (required)*</Text>}
              returnKeyType="done"
              testID="text-input"
              hasValidation={false}
            />
          </AMAProvider>,
        );
        await act(() => {
          expect(
            renderAPI.getByTestId('text-input').props.accessibilityLabel,
          ).toBe('First name (required)');
        });
      });
    });

    it('uses the accessibilityLabel only if provided', async () => {
      const renderAPI = render(
        <AMAProvider>
          <TextInput
            labelComponent={<Text>First name (required)*</Text>}
            returnKeyType="done"
            testID="text-input"
            accessibilityLabel="Please insert your first name"
            hasValidation={false}
          />
        </AMAProvider>,
      );
      await act(() => {
        expect(
          renderAPI.getByTestId('text-input').props.accessibilityLabel,
        ).toBe('Please insert your first name');
      });
    });
  });

  it('calls focusNextFormField onSubmitEditing event', async () => {
    const focusNextFormField = jest.fn();

    jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
      focusNextFormField,
    } as any);

    const fn = jest.fn();

    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          onSubmitEditing={fn}
          hasValidation={false}
        />
      </AMAProvider>,
    );
    await act(() => {
      fireEvent(
        renderAPI.getByTestId('text-input'),
        'onSubmitEditing',
        'whatever',
      );

      expect(fn).toHaveBeenCalledWith('whatever');
    });
  });

  it('ignores the errorComponent message if hasError is not true', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          hasValidation={true}
          hasError={false}
          errorMessage={'This is the errorComponent'}
          errorComponent={<></>}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
        '',
      );
    });
  });

  it('when hasError uses the text from the errorComponent as part of the accessibilityHint', async () => {
    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          accessibilityHint="The hint"
          hasValidation={true}
          hasError={true}
          errorComponent={<Text>The first name cannot be blank</Text>}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
        'The hint, The first name cannot be blank',
      );
    });
  });

  it('when hasError uses the errorText, if specified, as part of the accessibilityHint', async () => {
    const renderAPI = render(
      <AMAProvider>
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
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.getByTestId('text-input').props.accessibilityHint).toBe(
        'The hint, This text will be used',
      );
    });
  });

  it('apply the style returned by useFormField', async () => {
    const focusNextFormField = jest.fn();

    jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
      focusNextFormField,
      style: ERROR_STYLE,
    } as any);

    const renderAPI = render(
      <AMAProvider>
        <TextInput
          labelComponent={<Text>First name (required)*</Text>}
          returnKeyType="next"
          testID="text-input"
          accessibilityLabel="Please insert your first name"
          hasValidation={false}
        />
      </AMAProvider>,
    );
    await act(() => {
      expect(renderAPI.getByTestId('text-input').props.style).toEqual(
        ERROR_STYLE,
      );
    });
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
      (useChecks as jest.Mock).mockReturnValue({
        noUppercaseStringChecker: accessibilityLabelChecker,
        noUndefinedProperty,
        uppercaseChecker,
        onLayout,
      } as any);

      TextInputWithoutDev = require('./TextInput').TextInput;
    });

    it('does not perform any check', async () => {
      render(
        <AMAProvider>
          <TextInputWithoutDev
            labelComponent={<Text>First name (required)*</Text>}
            returnKeyType="next"
            testID="text-input"
            accessibilityLabel="Please insert your first name"
            hasValidation={false}
          />
        </AMAProvider>,
      );
      await act(() => {
        expect(noUndefinedProperty).not.toHaveBeenCalled();
      });
    });

    it('does not apply the debug style', async () => {
      jest.spyOn(UseFormField, 'useFormField').mockReturnValue({
        style: ERROR_STYLE,
      } as any);

      const { getByTestId } = render(
        <AMAProvider>
          <TextInputWithoutDev
            labelComponent={<Text>First name (required)*</Text>}
            returnKeyType="next"
            testID="text-input"
            accessibilityLabel="Please insert your first name"
            hasValidation={false}
          />
        </AMAProvider>,
      );
      await act(() => {
        expect(getByTestId('text-input').props.style).toEqual(undefined);
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
    useChecks: jest.fn(),
  };
});
