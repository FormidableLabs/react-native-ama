import type { RefObject } from 'react';
import type { AmaError, AmaRule } from './types';

export type UseAMADevValue = {
  issues: AmaError[];
  trackError: (rule: AmaRule, ref?: RefObject<any>) => void;
};

export type UseAMADev = () => UseAMADevValue;

type UseAMADevModule = {
  useAMADev: UseAMADev | null;
};

export const useAMADev: UseAMADev | null = __DEV__
  ? (require('./useAMADev.dev') as UseAMADevModule).useAMADev
  : null;
