import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import * as UseChecks from '../internal/useChecks';
import * as AMAProvider from '../providers/AMAProvider';
import * as Form from '../providers/Form';
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
      isEditable: true,
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

jest.mock('../providers/AMAProvider');
jest.mock('./useFocus', () => mockUseFocus());
jest.mock('../internal/checks/checkFocusTrap', () => {
  return {
    checkFocusTrap: jest.fn().mockResolvedValue(null),
  };
});
