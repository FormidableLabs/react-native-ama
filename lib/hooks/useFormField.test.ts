import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import * as UseChecks from '../internal/useChecks';
import * as Form from '../providers/Form';
import { useFormField } from './useFormField';

beforeEach(() => {
  jest.clearAllMocks();
});

let onSubmit: jest.Mock = jest.fn();

describe('useFormField', () => {
  let localRef: any[] = [];

  beforeEach(() => {
    jest.spyOn(Form, 'useForm').mockImplementation(() => {
      return { refs: localRef, onSubmit };
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
      });
    });

    expect(localRef).toHaveLength(1);
    expect(localRef[0]).toEqual({
      hasFocusCallback: false,
      ref: { current: { current: 'hello' } },
      id: 'my-id',
    });
  });

  it('unregister itself from the refs when is mounted', () => {
    const { unmount } = renderHook(() => {
      return useFormField({
        ref: { current: 'hello' },
        hasFocusCallback: false,
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
          });

          // next field
          useFormField({ ref, hasFocusCallback: false });

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
          });

          // next field
          useFormField({ ref, hasFocusCallback: true });

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
            });

            // next field
            useFormField({ ref, hasFocusCallback: false });

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
            });

            // next field
            useFormField({ ref, hasFocusCallback: true });

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
          });

          // Second field
          useFormField({
            ref: { current: 'second-ref' },
            hasFocusCallback: false,
          });

          // next field
          useFormField({
            ref,
            hasFocusCallback: false,
            id: 'latest-field',
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
          });

          // Second field
          useFormField({
            ref: { current: 'second-ref' },
            hasFocusCallback: false,
          });

          // next field
          useFormField({
            ref,
            hasFocusCallback: false,
            id: 'latest-field',
          });

          return first;
        });

        result.current.focusNextFormField();

        expect(setFocus).toHaveBeenCalledWith(ref.current);
      });
    });

    it('triggers onSubmit when the element is the last one of the ref', function () {
      const ref = { current: 'whatever' };

      const { result } = renderHook(() => {
        useFormField({
          ref: { current: 'random ref' },
          hasFocusCallback: false,
        });

        // next field
        return useFormField({ ref, hasFocusCallback: false });
      });

      result.current.focusNextFormField();

      expect(onSubmit).toHaveBeenCalledWith();
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
