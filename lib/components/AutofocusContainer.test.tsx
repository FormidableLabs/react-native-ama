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
});

jest.mock('../hooks/useFocus');
