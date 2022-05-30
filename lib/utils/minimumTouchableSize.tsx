import { Platform } from 'react-native';

export const MINIMUM_TOUCHABLE_SIZE = Platform.OS === 'android' ? 48 : 44;
