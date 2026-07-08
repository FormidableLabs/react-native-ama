import { Platform } from 'react-native';

const ANDROID_MINIMUM_TOUCHABLE_SIZE = 48;
const IOS_MINIMUM_TOUCHABLE_SIZE = 44;

export const MINIMUM_TOUCHABLE_SIZE =
  Platform.OS === 'android'
    ? ANDROID_MINIMUM_TOUCHABLE_SIZE
    : IOS_MINIMUM_TOUCHABLE_SIZE;
