import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  AppState,
  AppStateStatus,
  Platform,
} from 'react-native';

import { areAnimationsEnabled } from '../modules/AMAAnimationsStatusModule';

type AMAProviderProps = {
  children: React.ReactNode;
};

type AccessibilityEvents = Exclude<AccessibilityChangeEventName, 'change'>;

type AccessibilityInfoEvents = {
  [key in AccessibilityEvents]: keyof AMAContextValue;
};

const eventsMapping: AccessibilityInfoEvents = {
  reduceTransparencyChanged: 'isReduceTransparencyEnabled',
  reduceMotionChanged: 'isReduceMotionEnabled',
  grayscaleChanged: 'isGrayscaleEnabled',
  boldTextChanged: 'isBoldTextEnabled',
  invertColorsChanged: 'isInvertColorsEnabled',
  screenReaderChanged: 'isScreenReaderEnabled',
};

export const AMAProvider: React.FC<AMAProviderProps> = ({ children }) => {
  const [values, setValues] = React.useState(DEFAULT_VALUES);
  const appState = React.useRef('inactive');

  const handleAccessibilityInfoChanged = (key: keyof AMAContextValue) => {
    return (newValue: boolean) => {
      const newValues = values;
      newValues[key] = newValue;

      setValues(newValues);
    };
  };

  const checkAndroidAnimationStatus = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      areAnimationsEnabled().then(enabled => {
        handleAccessibilityInfoChanged('isReduceMotionEnabled')(!enabled);
      });
    }

    appState.current = nextAppState;
  };

  React.useEffect(() => {
    const subscriptions = Object.entries(eventsMapping).map(
      ([eventName, contextKey]) => {
        return AccessibilityInfo.addEventListener(
          eventName as AccessibilityEvents,
          handleAccessibilityInfoChanged(contextKey),
        );
      },
    );

    if (Platform.OS === 'android') {
      subscriptions.push(
        AppState.addEventListener('change', checkAndroidAnimationStatus),
      );

      checkAndroidAnimationStatus('active');
    }

    return () => {
      // @ts-ignore - RN >= 0.65
      if (typeof subscriptions?.[0]?.remove === 'function') {
        // @ts-ignore
        return subscriptions.forEach(subscription => subscription.remove());
      }

      Object.entries(eventsMapping).forEach(([eventName, contextKey]) => {
        return AccessibilityInfo.removeEventListener(
          eventName as AccessibilityEvents,
          handleAccessibilityInfoChanged(contextKey),
        );
      });

      AppState.removeEventListener('change', checkAndroidAnimationStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AMAContext.Provider value={values}>{children}</AMAContext.Provider>;
};

export type AMAContextValue = {
  isBoldTextEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
};

const DEFAULT_VALUES: AMAContextValue = {
  isReduceTransparencyEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
};

const AMAContext = React.createContext<AMAContextValue>(DEFAULT_VALUES);

export const useAMAContext = () => React.useContext(AMAContext);
