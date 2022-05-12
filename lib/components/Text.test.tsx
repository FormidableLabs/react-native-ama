import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseA11yFocus from '../hooks/useA11yFocus';
import { Text } from './Text';

describe('Text', () => {
  it.each([false, undefined])(
    'calls useA11yFocus with undefined if the "autofocus" property is %s',
    autofocus => {
      const spy = jest.spyOn(UseA11yFocus, 'useA11yFocus');

      render(<Text autofocus={autofocus} />);

      expect(spy).toHaveBeenCalledWith(undefined);
    },
  );

  it('calls useA11yFocus with the component ref if autofocus is true', () => {
    const spy = jest.spyOn(UseA11yFocus, 'useA11yFocus').mockImplementation();

    render(<Text autofocus />);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(Object) }),
    );
  });
});
