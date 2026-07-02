import { renderHook, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import * as Form from '../components/Form';
import { useFormField } from './useFormField';
import * as CheckFocusTrapModule from '../utils/checkFocusTrap';

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

    it('calls focusField with the next ref when not the last field', async () => {
      const focusField = jest.fn();
      jest.spyOn(Form, 'useForm').mockImplementation(() => ({
        refs: localRef,
        submitForm,
        focusField,
      }));

      const { result } = renderHook(
        () => {
          // first field
          const first = useFormField({
            ref: { current: 'first' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // second field
          useFormField({
            ref: { current: 'second' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          return first;
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();
        expect(focusField).toHaveBeenCalled();
      });
    });

    it('uses nextFormFieldRef when provided', async () => {
      const focusField = jest.fn();
      jest.spyOn(Form, 'useForm').mockImplementation(() => ({
        refs: localRef,
        submitForm,
        focusField,
      }));

      const nextFormFieldRef = { current: 'explicit-next' };

      const { result } = renderHook(
        () => {
          const first = useFormField({
            ref: { current: 'first' },
            hasFocusCallback: false,
            hasValidation: false,
            nextFormFieldRef,
          });

          useFormField({
            ref: { current: 'second' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          return first;
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();
        expect(focusField).toHaveBeenCalledWith(
          expect.objectContaining({ ref: nextFormFieldRef }),
        );
      });
    });

    it('calls checkFocusTrap when hasFocusCallback is true and not the last field', async () => {
      const focusField = jest.fn();
      const checkFocusTrapSpy = jest.spyOn(CheckFocusTrapModule as { checkFocusTrap: (...args: any[]) => Promise<void> }, 'checkFocusTrap').mockResolvedValue(undefined);
      jest.spyOn(Form, 'useForm').mockImplementation(() => ({
        refs: localRef,
        submitForm,
        focusField,
      }));

      const { result } = renderHook(
        () => {
          const first = useFormField({
            ref: { current: 'first' },
            hasFocusCallback: true,
            hasValidation: false,
          });

          useFormField({
            ref: { current: 'second' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          return first;
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();
        expect(checkFocusTrapSpy).toHaveBeenCalledWith(
          expect.objectContaining({ shouldHaveFocus: false }),
        );
      });

      checkFocusTrapSpy.mockRestore();
    });

    it('does not call checkFocusTrap when hasFocusCallback is false', async () => {
      const focusField = jest.fn();
      const checkFocusTrapSpy = jest.spyOn(CheckFocusTrapModule as { checkFocusTrap: (...args: any[]) => Promise<void> }, 'checkFocusTrap').mockResolvedValue(undefined);
      jest.spyOn(Form, 'useForm').mockImplementation(() => ({
        refs: localRef,
        submitForm,
        focusField,
      }));

      const { result } = renderHook(
        () => {
          const first = useFormField({
            ref: { current: 'first' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          useFormField({
            ref: { current: 'second' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          return first;
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();
        expect(checkFocusTrapSpy).not.toHaveBeenCalled();
      });

      checkFocusTrapSpy.mockRestore();
    });

    it('uses nextFieldId to find the next ref when provided', async () => {
      const focusField = jest.fn();
      jest.spyOn(Form, 'useForm').mockImplementation(() => ({
        refs: localRef,
        submitForm,
        focusField,
      }));

      const { result } = renderHook(
        () => {
          const first = useFormField({
            ref: { current: 'first' },
            hasFocusCallback: false,
            hasValidation: false,
            nextFieldId: 'second-field',
          });

          useFormField({
            ref: { current: 'second' },
            hasFocusCallback: false,
            hasValidation: false,
            id: 'second-field',
          });

          return first;
        },
        { wrapper: renderHookWrapper },
      );

      await waitFor(() => {
        result.current.focusNextFormField();
        expect(focusField).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'second-field' }),
        );
      });
    });
  });
});

const renderHookWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
