import { renderHook } from '@testing-library/react-hooks';

import * as AMAProvider from '../components/AMAProvider';
import { useAnimationDuration } from './useAnimationDuration';

describe('useAnimationDuration', () => {
  it('returns the given duration for motion animation when isReduceMotionEnabled is false', () => {
    jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
      ...amaContextValues,
      isReduceMotionEnabled: false,
    } as any);

    const { result } = renderHook(() => useAnimationDuration());

    expect(result.current.getAnimationDuration('left', 100)).toBe(100);
  });

  it('returns 0 for motion animation when isReduceMotionEnabled is true', () => {
    jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
      ...amaContextValues,
      isReduceMotionEnabled: true,
    } as any);

    const { result } = renderHook(() => useAnimationDuration());

    expect(result.current.getAnimationDuration('left', 100)).toBe(0);
  });
});

const amaContextValues = {
  isReduceTransparencyEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
};

jest.mock('../components/AMAProvider');
