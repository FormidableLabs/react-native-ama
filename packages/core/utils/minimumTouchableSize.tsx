import { Platform } from 'react-native';

export const ANDROID_MINIMUM_TOUCHABLE_SIZE = 48;
export const IOS_MINIMUM_TOUCHABLE_SIZE = 44;

export const MINIMUM_TOUCHABLE_SIZE =
  Platform.OS === 'android'
    ? ANDROID_MINIMUM_TOUCHABLE_SIZE
    : IOS_MINIMUM_TOUCHABLE_SIZE;
