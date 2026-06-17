import { renderHook, waitFor } from '@testing-library/react-native';
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
    it('triggers submitForm when the element is the last one of the ref', async () => {
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

const renderHookWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
