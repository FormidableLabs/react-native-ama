import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform } from 'react-native';

describe('ListWrapper', () => {
  it('renders the AMAFlatListWrapper is the Platform is Android', () => {
    Platform.OS = 'android';

    const { ListWrapper } = require('./ListWrapper');

    const result = render(<ListWrapper rowsCount={1} />);

    expect(result.toJSON()).toMatchInlineSnapshot(`
      <AmaFlatListWrapper
        columnsCount={1}
        rowsCount={1}
      />
    `);
  });
});
