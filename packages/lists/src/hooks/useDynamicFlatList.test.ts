import { renderHook } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { useDynamicList } from './useDynamicList';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useDynamicFlatList', () => {
  it('does not announce on first render', () => {
    renderHook(() =>
      useDynamicList({
        data: [1, 2, 3],
        singularMessage: '%count% item',
        pluralMessage: '%count% items',
      }),
    );

    expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
  });

  it('announces when data length changes from initial', () => {
    const { rerender } = renderHook(
      ({ data }: { data: number[] }) =>
        useDynamicList({
          data,
          singularMessage: '%count% item',
          pluralMessage: '%count% items',
        }),
      { initialProps: { data: [1, 2, 3] } },
    );

    rerender({ data: [1] });

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      '1 item',
    );
  });

  it('announces plural message when count > 1', () => {
    const { rerender } = renderHook(
      ({ data }: { data: number[] }) =>
        useDynamicList({
          data,
          singularMessage: '%count% item',
          pluralMessage: '%count% items',
        }),
      { initialProps: { data: [1, 2, 3] } },
    );

    rerender({ data: [1, 2] });

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      '2 items',
    );
  });
});
