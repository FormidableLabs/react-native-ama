import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { Form, FormContext } from './Form';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Form', () => {
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

    jest.advanceTimersByTime(51);

    expect(focus).toHaveBeenCalledWith();

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

  it('focusFieldAt focuses the field at the given index', async () => {
    const focus = jest.fn();
    const ref = React.createRef<any>();
    (ref as any).current = { focus, isFocused: jest.fn().mockReturnValue(false) };

    let formRef = React.createRef<any>();

    render(
      <Form ref={formRef} onSubmit={jest.fn()}>
        <FormContext.Consumer>
          {value => {
            value?.refs?.push({
              ref: { current: ref } as any,
              hasFocusCallback: true,
              hasValidation: false,
              isEditable: true,
              id: 'field0',
            });
            return null;
          }}
        </FormContext.Consumer>
      </Form>,
    );

    formRef.current?.focusFieldAt(0);

    await waitFor(() => expect(focus).toHaveBeenCalled());
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

var setFocus: jest.Mock;

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

jest.mock('../hooks/useFocus', () => mockUseFocus());

describe('useForm', () => {
  it('returns default context value when suppressError is true and no Form wrapper', () => {
    const { useForm } = require('./Form');
    const { renderHook } = require('@testing-library/react-native');

    const { result } = renderHook(() => useForm({ suppressError: true }));
    expect(result.current.refs).toEqual([]);
    expect(typeof result.current.submitForm).toBe('function');
  });

  it('throws when called outside Form and suppressError is false', () => {
    const { useForm } = require('./Form');
    const { renderHook } = require('@testing-library/react-native');

    expect(() => renderHook(() => useForm())).toThrow(
      'useForm must be used within a FormContextProvider',
    );
  });

  it('logs a console.error in __DEV__ when called outside Form', () => {
    const { useForm } = require('./Form');
    const { renderHook } = require('@testing-library/react-native');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-ignore
    global.__DEV__ = true;

    expect(() => renderHook(() => useForm())).toThrow();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
    // @ts-ignore
    global.__DEV__ = true;
  });
});
