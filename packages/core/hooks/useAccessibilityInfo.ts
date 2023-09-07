import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  NativeEventSubscription,
} from 'react-native';

export type UseAccessibilityInfo = {
  isBoldTextEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  reactNavigationScreenOptions: {
    animationEnabled: boolean;
    animation: 'default' | 'fade';
  };
};

type AccessibilityEvents = Exclude<AccessibilityChangeEventName, 'change'>;

type AccessibilityInfoEvents = {
  [key in AccessibilityEvents]: Exclude<
    keyof UseAccessibilityInfo,
    'reactNavigationScreenOptions' | 'trackError' | 'removeError'
  >;
};

const DEFAULT_VALUES: UseAccessibilityInfo = {
  isReduceTransparencyEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
  reactNavigationScreenOptions: {
    animationEnabled: true,
    animation: 'default',
  },
};

const EVENTS_MAPPING: AccessibilityInfoEvents = {
  reduceTransparencyChanged: 'isReduceTransparencyEnabled',
  reduceMotionChanged: 'isReduceMotionEnabled',
  grayscaleChanged: 'isGrayscaleEnabled',
  boldTextChanged: 'isBoldTextEnabled',
  invertColorsChanged: 'isInvertColorsEnabled',
  screenReaderChanged: 'isScreenReaderEnabled',
};

export const useAccessibilityInfo = (): UseAccessibilityInfo => {
  const [values, setValues] = React.useState(DEFAULT_VALUES);

  const handleAccessibilityInfoChanged = (
    key: Exclude<keyof UseAccessibilityInfo, 'reactNavigationScreenOptions'>,
  ) => {
    return (newValue: boolean) => {
      setValues(oldValues => {
        const newValues = { ...oldValues };
        newValues[key] = newValue;

        if (key === 'isReduceMotionEnabled') {
          newValues.reactNavigationScreenOptions.animationEnabled = !newValue;
          newValues.reactNavigationScreenOptions.animation = newValue
            ? 'fade'
            : 'default';
        }

        return {
          ...oldValues,
          ...newValues,
        };
      });
    };
  };

  React.useEffect(() => {
    const allInitPromises: Promise<boolean>[] = [];

    const subscriptions: NativeEventSubscription[] = Object.entries(
      EVENTS_MAPPING,
    ).map(([eventName, contextKey]) => {
      allInitPromises.push(AccessibilityInfo[contextKey]());

      return AccessibilityInfo.addEventListener(
        eventName as AccessibilityEvents,
        handleAccessibilityInfoChanged(contextKey),
      );
    });

    Promise.all(allInitPromises).then(promisesValues => {
      const newValues = Object.values(EVENTS_MAPPING).reduce(
        (list, key, index) => {
          list[key] = promisesValues[index] as boolean;

          return list;
        },
        {} as UseAccessibilityInfo,
      );

      setValues(oldValues => {
        return {
          ...oldValues,
          ...newValues,
        };
      });
    });

    return () => {
      subscriptions.forEach(subscription => subscription?.remove());
    };
  }, []);

  return values;
};
