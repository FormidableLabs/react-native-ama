import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import * as UseFocus from '../hooks/useFocus';
import { AutofocusContainer } from './AutofocusContainer';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AutofocusContainer', () => {
  it('it call setFocus when gets rendered', async () => {
    const setFocus = jest.fn();
    jest.spyOn(UseFocus, 'useFocus').mockReturnValue({
      setFocus,
    });

    render(
      <AutofocusContainer>
        <></>
      </AutofocusContainer>,
    );

    await waitFor(() => expect(setFocus).toBeCalled());
  });

  it.each([undefined, true])(
    'wraps the children with an accessible View when wrapChildrenInAccessibleView is %s',
    async () => {
      const setFocus = jest.fn();
      jest.spyOn(UseFocus, 'useFocus').mockReturnValue({
        setFocus,
      });

      const renderAPI = render(
        <AutofocusContainer wrapChildrenInAccessibleView={true}>
          <></>
        </AutofocusContainer>,
      );

      await waitFor(() => expect(setFocus).toBeCalled());

      expect(
        renderAPI.getByTestId('autofocusContainer.accessibleView'),
      ).toBeDefined();
    },
  );

  it('does not wrap the children with an accessible View when wrapChildrenInAccessibleView is false', async () => {
    const setFocus = jest.fn();
    jest.spyOn(UseFocus, 'useFocus').mockReturnValue({
      setFocus,
    });

    const renderAPI = render(
      <AutofocusContainer wrapChildrenInAccessibleView={false}>
        <></>
      </AutofocusContainer>,
    );

    await waitFor(() => expect(setFocus).toBeCalled());

    expect(
      renderAPI.queryByTestId('autofocusContainer.accessibleView'),
    ).toBeNull();
  });
});

jest.mock('../hooks/useFocus');
