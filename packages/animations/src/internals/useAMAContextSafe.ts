const AMACore = require('@react-native-ama/core');

const SAFE_DEFAULTS = {
  isReduceMotionEnabled: false,
};

export const useAMAContextSafe = (): { isReduceMotionEnabled: boolean } => {
  try {
    return AMACore?.useAMAContext?.() ?? SAFE_DEFAULTS;
  } catch {
    return SAFE_DEFAULTS;
  }
};
