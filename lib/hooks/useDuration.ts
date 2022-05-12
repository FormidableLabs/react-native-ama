import { useAMAContext } from '../components/AMAProvider';

export const useDuration = () => {
  const { isReduceMotionEnabled } = useAMAContext();

  const duration = (
    normalDuration: number,
    reduceMotionDuration: number = 3,
  ) => {
    return isReduceMotionEnabled ? normalDuration : reduceMotionDuration;
  };

  return {
    duration,
  };
};
