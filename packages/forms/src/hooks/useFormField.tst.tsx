import * as AMAProvider from '@react-native-ama/core';
import { renderHook } from '@testing-library/react-native';
import { waitFor } from '@testing-library/react-native';
import * as React from 'react';

import * as Form from '../components/Form';
import { useFormField } from './useFormField';

beforeEach(() => {
  jest.clearAllMocks();
});

let submitForm: jest.Mock = jest.fn();

describe('useFormField', () => {
  let localRef: any[] = [];

  beforeEach(() => {
    jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
      isScreenReaderEnabled: true,
    } as any);

    jest.spyOn(Form, 'useForm').mockImplementation(() => {
      return { refs: localRef, submitForm };
    });
  });

  afterEach(function () {
    localRef.splice(-1);
  });

  it('register itself as ref when is mounted', async () => {
    renderHook(
      () => {
        return useFormField({
          ref: { current: 'hello' },
          hasFocusCallback: false,
          id: 'my-id',
          nextFieldId: 'next-field-id',
          nextFormFieldRef: { current: 'nextFormFieldRef' },
          hasValidation: false,
        });
      },
      { wrapper: renderHookWrapper },
    );

    await waitFor(() => {
      expect(localRef).toHaveLength(1);
      expect(localRef[0]).toEqual({
        hasFocusCallback: false,
        ref: { current: { current: 'hello' } },
        id: 'my-id',
        hasError: undefined,
        hasValidation: false,
        isEditable: true,
      });
    });
  });

  it('unregister itself from the refs when is mounted', () => {
    const { unmount } = renderHook(
      () => {
        return useFormField({
          ref: { current: 'hello' },
          hasFocusCallback: false,
          hasValidation: false,
        });
      },
      { wrapper: renderHookWrapper },
    );

    unmount();

    expect(localRef.length).toBe(0);
  });

  describe('focusNextFormField', () => {
    describe('Given the form field is not the last of the refs', () => {
      describe('checks for focus when calling focusNextFormField', function () {
        it('checks only against the current field if next one does not have the focus callback', async () => {
          const focus = jest.fn();
          const ref = { current: { focus, isFocused: jest.fn() } };

          const { result } = renderHook(
            () => {
              const first = useFormField({
                ref: { current: 'random ref' },
                hasFocusCallback: true,
                hasValidation: false,
              });

              // next field
              useFormField({
                ref,
                hasFocusCallback: false,
                hasValidation: false,
              });

              return first;
            },
            { wrapper: renderHookWrapper },
          );

          result.current.focusNextFormField();

          await waitFor(() =>
            expect(checkFocusTrap).toHaveBeenCalledWith({
              ref: { current: 'random ref' },
              shouldHaveFocus: false,
            }),
          );

          expect(checkFocusTrap).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('triggers submitForm when the element is the last one of the ref', async () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        isScreenReaderEnabled: true,
      } as any);

      const ref = { current: 'whatever' };

      const { result } = renderHook(
        () => {
          useFormField({
            ref: { current: 'random ref' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // next field
          return useFormField({
            ref,
            hasFocusCallback: false,
            hasValidation: false,
          });
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();

        expect(submitForm).toHaveBeenCalledWith();
      });
    });
  });
});

let setFocus: jest.Mock;
let checkFocusTrap: jest.Mock;

function mockAMACore() {
  const original = jest.requireActual('@react-native-ama/core');

  setFocus = jest.fn();

  return {
    ...original,
    useFocus: () => {
      return {
        setFocus,
      };
    },
  };
}

function mockAMAInternal() {
  const original = jest.requireActual('@react-native-ama/internal');

  checkFocusTrap = jest.fn().mockResolvedValue(null);

  return { ...original, checkFocusTrap };
}

const renderHookWrapper = ({ children }) => (
  <AMAProvider.AMAProvider>{children}</AMAProvider.AMAProvider>
);

jest.mock('@react-native-ama/core', () => mockAMACore());
jest.mock('@react-native-ama/internal', () => mockAMAInternal());
