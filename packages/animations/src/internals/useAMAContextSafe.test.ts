import { renderHook } from '@testing-library/react-native';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('useAMAContextSafe', () => {
  it('returns isReduceMotionEnabled from core when core is present', () => {
    jest.doMock('@react-native-ama/core', () => ({
      useAMAContext: () => ({ isReduceMotionEnabled: true }),
    }));

    const { useAMAContextSafe: safe } =
      require('./useAMAContextSafe') as typeof import('./useAMAContextSafe');
    const { result } = renderHook(() => safe());

    expect(result.current.isReduceMotionEnabled).toBe(true);
  });

  it('returns isReduceMotionEnabled: false when core is absent', () => {
    jest.doMock('@react-native-ama/core', () => null);

    const { useAMAContextSafe: safe } =
      require('./useAMAContextSafe') as typeof import('./useAMAContextSafe');
    const { result } = renderHook(() => safe());

    expect(result.current.isReduceMotionEnabled).toBe(false);
  });

  it('returns isReduceMotionEnabled: false when useAMAContext throws', () => {
    jest.doMock('@react-native-ama/core', () => ({
      useAMAContext: () => {
        throw new Error('Please wrap your app with <AMAProvider />');
      },
    }));

    const { useAMAContextSafe: safe } =
      require('./useAMAContextSafe') as typeof import('./useAMAContextSafe');
    const { result } = renderHook(() => safe());

    expect(result.current.isReduceMotionEnabled).toBe(false);
  });
});
