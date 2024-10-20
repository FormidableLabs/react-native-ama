import { useChecks } from '@react-native-ama/core';
import { renderHook } from '@testing-library/react-native';

import { useDynamicList } from './useDynamicList';

beforeEach(() => {
  jest.clearAllMocks();
});

const logResult = jest.fn();

describe('useDynamicFlatList', () => {
  beforeEach(function () {
    //@ts-ignore
    (useChecks as jest.Mock).mockReturnValue({
      logResult,
    });
  });

  it('checks that the singular message contains the word %count%', () => {
    renderHook(() =>
      useDynamicList({
        data: [],
        singularMessage: 'hello',
        pluralMessage: '%count% me',
      }),
    );

    expect(logResult).toHaveBeenCalledWith('useDynamicFlatList', {
      extra: 'hello',
      message: 'Special string %count% not found in singularMessage',
      rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE',
    });
  });

  it('checks that the plural message contains the word %count%', () => {
    renderHook(() =>
      useDynamicList({
        data: [],
        accessibilitySingularMessage: '%count% ok',
      } as any),
    );

    expect(logResult).toHaveBeenCalledWith('useDynamicFlatList', {
      extra: undefined,
      message: 'Special string %count% not found in pluralMessage',
      rule: 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
    });
  });
});

jest.mock('@react-native-ama/core', () => ({
  useChecks: jest.fn(),
}));
