import * as UseChecks from '@react-native-ama/core';
import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';

import { Form, FormContext } from './Form';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Form', () => {
  let checkFocusTrap: jest.Mock;

  beforeEach(function () {
    checkFocusTrap = jest.fn().mockResolvedValue(null);

    // @ts-ignore
    jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
      checkFocusTrap,
      hasErrors: true,
    } as any);
  });

  it('checks that next field has the focus if it has the focus callback', async () => {
    const focus = jest.fn();
    const ref = { current: { focus, isFocused: jest.fn() } };
    const secondField = {
      ref,
      hasFocusCallback: true,
      hasValidation: false,
      isEditable: true,
      id: 'second',
    };

    let providerValues = customRender();

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.focusField?.(secondField);

    await waitFor(() =>
      expect(checkFocusTrap).toHaveBeenCalledWith({
        ref: {
          current: {
            focus: expect.any(Function),
            isFocused: expect.any(Function),
          },
        },
        shouldHaveFocus: true,
      }),
    );
  });

  it('calls setFocus if the next field has no .focus callback', () => {
    const ref = { current: 'whatever' };
    const secondField = {
      ref,
      id: 'second',
    };

    let providerValues = customRender();

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.focusField?.(secondField);

    expect(setFocus).toHaveBeenCalledWith('whatever');
  });

  it('calls the .focus callback if the next field has it and is editable', async () => {
    const focus = jest.fn();
    const ref = { current: { focus, isFocused: jest.fn() } };
    const secondField = {
      ref,
      hasFocusCallback: true,
      hasValidation: false,
      isEditable: true,
      id: 'second',
    };

    let providerValues = customRender();

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.focusField?.(secondField);

    await waitFor(() => expect(focus).toHaveBeenCalledWith());
  });

  it('awaits 50ms before triggering again the `focus` event if the component already have the focus', async () => {
    jest.useFakeTimers();

    const focus = jest.fn();
    const ref = {
      current: { focus, isFocused: jest.fn().mockReturnValue(true) },
    };
    const secondField = {
      ref,
      hasFocusCallback: true,
      hasValidation: false,
      isEditable: true,
      id: 'second',
    };

    let providerValues = customRender();

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.focusField?.(secondField);

    expect(focus).not.toHaveBeenCalled();
    expect(checkFocusTrap).not.toHaveBeenCalled();

    jest.advanceTimersByTime(51);

    expect(focus).toHaveBeenCalledWith();

    await waitFor(() =>
      expect(checkFocusTrap).toHaveBeenCalledWith({
        ref: {
          current: {
            focus: expect.any(Function),
            isFocused: expect.any(Function),
          },
        },
        shouldHaveFocus: true,
      }),
    );

    jest.useRealTimers();
  });

  it('calls the setFocus callback if the next field is not editable', () => {
    const focus = jest.fn();
    const ref = { current: { focus, isFocused: jest.fn() } };
    const secondField = {
      ref,
      hasFocusCallback: true,
      hasValidation: false,
      isEditable: false,
      id: 'second',
    };

    let providerValues = customRender();

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.focusField?.(secondField);

    expect(setFocus).toHaveBeenCalledWith(ref.current);
  });

  it('focuses the first failed component when submitForm fails', async () => {
    const onSubmit = jest.fn().mockReturnValue(false);

    const focus = jest.fn();
    const ref = { current: { focus, isFocused: jest.fn() } };
    const secondField = {
      ref,
      hasFocusCallback: true,
      hasValidation: true,
      hasError: true,
      isEditable: false,
      id: 'second',
    };

    let providerValues = customRender(onSubmit);

    providerValues.refs?.push({
      ref: { current: 'random ref' },
      hasFocusCallback: false,
      hasValidation: false,
      id: 'first',
    });

    // next field
    providerValues.refs?.push(secondField);

    providerValues.submitForm?.();

    await waitFor(() => expect(setFocus).toHaveBeenCalledWith(ref.current));
  });
});

let setFocus: jest.Mock;

function mockUseFocus() {
  setFocus = jest.fn();

  return {
    useFocus: () => {
      return {
        setFocus,
      };
    },
  };
}

function customRender(onSubmit = jest.fn()) {
  let providerValues: any;

  render(
    <Form onSubmit={onSubmit}>
      <FormContext.Consumer>
        {value => {
          providerValues = value;

          return null;
        }}
      </FormContext.Consumer>
    </Form>,
  );

  return providerValues;
}

jest.mock('@react-native-ama/core', () => ({
  ...mockUseFocus(),
  useChecks: jest.fn(),
}));
jest.mock('@react-native-ama/internal', () => {
  return {
    checkFocusTrap: jest.fn().mockResolvedValue(null),
    isFocused: jest.fn().mockReturnValue(false),
  };
});
