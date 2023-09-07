import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform } from 'react-native';

describe('ListWrapper', () => {
  it('renders an empty wrapper is the Platform is iOS', () => {
    Platform.OS = 'ios';

    const { ListWrapper } = require('./ListWrapper');

    const result = render(<ListWrapper rowsCount={1} />);

    expect(result.toJSON()).toMatchInlineSnapshot('null');
  });
});
