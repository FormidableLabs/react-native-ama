import { AutofocusContainer } from '@react-native-ama/core';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseReanimatedAnimationBuilder from '../hooks/useReanimatedAnimationBuilder';
import { AnimatedContainer } from './AnimatedContainer';

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'warn').mockImplementation();
});

const from = { left: 0 };
const to = { opacity: 1 };

describe('AnimatedContainer', () => {
  it('passes the given animation data to the hook', () => {
    const useReanimatedAnimationBuilder = jest
      .spyOn(UseReanimatedAnimationBuilder, 'useReanimatedAnimationBuilder')
      .mockReturnValue({ exiting: 'exiting', entering: 'entering' } as any);

    const { getByTestId } = render(
      <AnimatedContainer testID="test-id" from={from} to={to} />,
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
      style: undefined,
      testID: 'test-id',
    });
  });

  it('passes the given animation data to the hook 2', () => {
    const useReanimatedAnimationBuilder = jest
      .spyOn(UseReanimatedAnimationBuilder, 'useReanimatedAnimationBuilder')
      .mockReturnValue({ exiting: 'exiting', entering: 'entering' } as any);

    const { getByTestId } = render(
      <AnimatedContainer testID="test-id" from={from} to={to} duration={600} />,
    );

    expect(useReanimatedAnimationBuilder).toHaveBeenCalledWith({
      from,
      to,
      duration: 600,
      exit: undefined,
    });

    expect(getByTestId('test-id').props).toEqual({
      children: undefined,
      entering: 'entering',
      exiting: 'exiting',
      style: undefined,
      testID: 'test-id',
    });
  });

  it('wraps the content with the AutofocusContainer when the autofocus property is true', () => {
    const { UNSAFE_getAllByType } = render(
      <AnimatedContainer
        testID="test-id"
        from={from}
        to={to}
        duration={300}
        autofocus
      />,
    );

    expect(UNSAFE_getAllByType(AutofocusContainer)).toBeDefined();
  });
});

jest.mock('../hooks/useReanimatedAnimationBuilder');
jest.mock('../hooks/useFocus', () => {
  return {
    useFocus: () => {
      return {
        setFocus: jest.fn(),
      };
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  return {
    View: (props: any) => <View {...props} />,
  };
});
