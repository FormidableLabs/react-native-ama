import { renderHook } from '@testing-library/react-native';

const mockTrackError = jest.fn();
const mockUseAMAContext = jest.fn(() => ({ trackError: mockTrackError }));

jest.mock('@react-native-ama/core', () => ({
  useAMAContext: () => mockUseAMAContext(),
}));

import { useDynamicList } from './useDynamicList';

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAMAContext.mockReturnValue({ trackError: mockTrackError });
});

describe('useDynamicList validation checks', () => {
  it('calls trackError with FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE when singularMessage lacks %count%', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: 'one item',
        pluralMessage: '%count% items',
      }),
    );

    expect(mockTrackError).toHaveBeenCalledWith(
      'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE',
    );
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('calls trackError with FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE when pluralMessage lacks %count%', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: '%count% item',
        pluralMessage: 'many items',
      }),
    );

    expect(mockTrackError).toHaveBeenCalledWith(
      'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
    );
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('does not call trackError or console.error when both messages contain %count%', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: '%count% item',
        pluralMessage: '%count% items',
      }),
    );

    expect(mockTrackError).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('falls back to console.error when no AMAProvider is present', () => {
    mockUseAMAContext.mockImplementation(() => {
      throw new Error('Please wrap your app with <AMAProvider />');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useDynamicList({
        data: [1, 2],
        singularMessage: 'one item',
        pluralMessage: 'many items',
      }),
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'useDynamicFlatList',
      expect.objectContaining({ rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE' }),
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'useDynamicFlatList',
      expect.objectContaining({ rule: 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE' }),
    );

    errorSpy.mockRestore();
  });
});
