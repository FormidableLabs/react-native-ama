import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import * as UseChecks from '../internal/useChecks';
import * as Form from '../providers/Form';
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

  it('register itself as ref when is mounted', () => {
    renderHook(() => {
      return useFormField({
        ref: { current: 'hello' },
        hasFocusCallback: false,
        id: 'my-id',
        nextFieldId: 'next-field-id',
        nextFormFieldRef: { current: 'nextFormFieldRef' },
        hasValidation: false,
      });
    });

    expect(localRef).toHaveLength(1);
    expect(localRef[0]).toEqual({
      hasFocusCallback: false,
      ref: { current: { current: 'hello' } },
      id: 'my-id',
      hasError: undefined,
      hasValidation: false,
    });
  });

  it('unregister itself from the refs when is mounted', () => {
    const { unmount } = renderHook(() => {
      return useFormField({
        ref: { current: 'hello' },
        hasFocusCallback: false,
        hasValidation: false,
      });
    });

    unmount();

    expect(localRef.length).toBe(0);
  });

  describe('focusNextFormField', () => {
    describe('Given the form field is not the last of the refs', () => {
      it('calls setFocus if the next field has no .focus callback', () => {
        const ref = { current: 'whatever' };

        const { result } = renderHook(() => {
          const first = useFormField({
            ref: { current: 'random ref' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // next field
          useFormField({ ref, hasFocusCallback: false, hasValidation: false });

          return first;
        });

        result.current.focusNextFormField();

        expect(setFocus).toHaveBeenCalledWith('whatever');
      });

      it('calls the .focus callback if the next field has it', () => {
        const focus = jest.fn();
        const ref = { current: { focus } };

        const { result } = renderHook(() => {
          const first = useFormField({
            ref: { current: 'random ref' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // next field
          useFormField({ ref, hasFocusCallback: true, hasValidation: false });

          return first;
        });

        result.current.focusNextFormField();

        expect(setFocus).not.toHaveBeenCalled();
        expect(focus).toHaveBeenCalledWith();
      });

      describe('checks for focus when calling focusNextFormField', function () {
        let checkFocusTrap: jest.Mock;

        beforeEach(function () {
          checkFocusTrap = jest.fn().mockResolvedValue(null);

          // @ts-ignore
          jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
            checkFocusTrap,
            hasErrors: true,
          } as any);
        });

        it('checks only against the current field if next one does not have the focus callback', async () => {
          const focus = jest.fn();
          const ref = { current: { focus, isFocused: jest.fn() } };

          const { result } = renderHook(() => {
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
          });

          result.current.focusNextFormField();

          await waitFor(() =>
            expect(checkFocusTrap).toHaveBeenCalledWith({
              ref: { current: 'random ref' },
              shouldHaveFocus: false,
            }),
          );

          expect(checkFocusTrap).toHaveBeenCalledTimes(1);
        });

        it('checks that next field has the focus if it has the focus callback', async () => {
          const focus = jest.fn();
          const ref = { current: { focus, isFocused: jest.fn() } };

          const { result } = renderHook(() => {
            const first = useFormField({
              ref: { current: 'random ref' },
              hasFocusCallback: false,
              hasValidation: false,
            });

            // next field
            useFormField({ ref, hasFocusCallback: true, hasValidation: false });

            return first;
          });

          result.current.focusNextFormField();

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
      });

      it('focuses the next nextFieldId when specified', () => {
        const ref = { current: 'latest-field-ref' };

        const { result } = renderHook(() => {
          // First field
          const first = useFormField({
            ref: { current: 'first-ref' },
            hasFocusCallback: false,
            nextFieldId: 'latest-field',
            hasValidation: false,
          });

          // Second field
          useFormField({
            ref: { current: 'second-ref' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // next field
          useFormField({
            ref,
            hasFocusCallback: false,
            id: 'latest-field',
            hasValidation: false,
          });

          return first;
        });

        result.current.focusNextFormField();

        expect(setFocus).toHaveBeenCalledWith(ref.current);
      });

      it('focuses the next nextFormFieldRef when specified', () => {
        const ref = { current: 'latest-field-ref' };

        const { result } = renderHook(() => {
          // First field
          const first = useFormField({
            ref: { current: 'first-ref' },
            hasFocusCallback: false,
            nextFormFieldRef: ref,
            hasValidation: false,
          });

          // Second field
          useFormField({
            ref: { current: 'second-ref' },
            hasFocusCallback: false,
            hasValidation: false,
          });

          // next field
          useFormField({
            ref,
            hasFocusCallback: false,
            id: 'latest-field',
            hasValidation: false,
          });

          return first;
        });

        result.current.focusNextFormField();

        expect(setFocus).toHaveBeenCalledWith(ref.current);
      });
    });

    it('triggers submitForm when the element is the last one of the ref', () => {
      const ref = { current: 'whatever' };

      const { result } = renderHook(() => {
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
      });

      result.current.focusNextFormField();

      expect(submitForm).toHaveBeenCalledWith();
    });

    it('focuses the first failed component when submitForm fails', () => {
      const consoleInfo = jest
        .spyOn(console, 'info')
        .mockImplementation(() => {});

      const ref = { current: 'whatever' };
      submitForm.mockReturnValue(true);

      const { result } = renderHook(() => {
        useFormField({
          ref: { current: 'random ref' },
          hasFocusCallback: false,
          hasValidation: true,
          hasError: true,
        });

        // next field
        return useFormField({
          ref,
          hasFocusCallback: false,
          hasValidation: true,
          hasError: true,
        });
      });

      act(() => {
        result.current.focusNextFormField();
      });

      expect(setFocus).toHaveBeenCalledWith('random ref');
      expect(setFocus).toHaveBeenCalledTimes(1);
      expect(consoleInfo).not.toHaveBeenCalled();
    });
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

jest.mock('./useFocus', () => mockUseFocus());
jest.mock('../internal/checks/checkFocusTrap', () => {
  return {
    checkFocusTrap: jest.fn().mockResolvedValue(null),
  };
});
