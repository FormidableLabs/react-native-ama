import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseReanimatedAnimationBuilder from '../hooks/useReanimatedAnimationBuilder';
import { AnimatedContainer } from './AnimatedContainer';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AnimatedContainer', () => {
  it('passes the given animation data to the hook', () => {
    const useReanimatedAnimationBuilder = jest
      .spyOn(UseReanimatedAnimationBuilder, 'useReanimatedAnimationBuilder')
      .mockReturnValue({ exiting: 'exiting', entering: 'entering' } as any);
    const from = { left: 0 };
    const to = { opacity: 1 };

    const { getByTestId } = render(
      <AnimatedContainer testID="test-id" from={from} to={to} duration={300} />,
    );

    expect(useReanimatedAnimationBuilder).toHaveBeenCalledWith({
      from,
      to,
      duration: 300,
      exit: undefined,
    });

    expect(getByTestId('test-id').props).toEqual({
      children: undefined,
      entering: 'entering',
      exiting: 'exiting',
      style: [undefined],
      testID: 'test-id',
    });
  });
});

jest.mock('../hooks/useReanimatedAnimationBuilder');
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  return {
    View: (props: any) => <View {...props} />,
  };
});
