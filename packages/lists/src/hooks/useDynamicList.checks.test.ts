import { renderHook } from '@testing-library/react-native';

const mockLogResult = jest.fn();

jest.mock('@react-native-ama/core', () => ({
  useChecks: jest.fn(() => ({ logResult: mockLogResult, debugStyle: {} })),
}));

import { useDynamicList } from './useDynamicList';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useDynamicList validation checks', () => {
  it('logs FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE when singularMessage lacks %count%', () => {
    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: 'one item',
        pluralMessage: '%count% items',
      }),
    );

    expect(mockLogResult).toHaveBeenCalledWith(
      'useDynamicFlatList',
      expect.objectContaining({ rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE' }),
    );
  });

  it('logs FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE when pluralMessage lacks %count%', () => {
    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: '%count% item',
        pluralMessage: 'many items',
      }),
    );

    expect(mockLogResult).toHaveBeenCalledWith(
      'useDynamicFlatList',
      expect.objectContaining({ rule: 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE' }),
    );
  });

  it('does not log when both messages contain %count%', () => {
    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: '%count% item',
        pluralMessage: '%count% items',
      }),
    );

    expect(mockLogResult).not.toHaveBeenCalled();
  });
});
