/* istanbul ignore file */
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package 'react-native-ama' doesn't seem to be linked. Make sure: \n\n" +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const linkingError =
  Platform.OS === 'android'
    ? new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        },
      )
    : undefined;

const AMAAnimationsStatus: {
  areAnimationsEnabled: () => Promise<boolean>;
} = NativeModules.AMAAnimationsStatus
  ? NativeModules.AMAAnimationsStatus
  : linkingError;

export const areAnimationsEnabled = (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return AMAAnimationsStatus.areAnimationsEnabled();
  }

  throw new Error('This native module is only available for Android!');
};
