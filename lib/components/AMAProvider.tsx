import * as React from 'react';
import { AccessibilityChangeEventName, AccessibilityInfo } from 'react-native';

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

  const handleAccessibilityInfoChanged = (key: keyof AMAContextValue) => {
    return (newValue: boolean) => {
      const newValues = values;
      newValues[key] = newValue;

      setValues(newValues);
    };
  };

  React.useEffect(() => {
    const subscriptions = Object.entries(eventsMapping).forEach(
      ([eventName, contextKey]) => {
        return AccessibilityInfo.addEventListener(
          eventName as AccessibilityEvents,
          handleAccessibilityInfoChanged(contextKey),
        );
      },
    );

    return () => {
      // @ts-ignore - RN >= 0.65
      if (typeof subscriptions[0]?.remove === 'function') {
        // @ts-ignore
        return subscriptions.forEach(subscription => subscription.remove());
      }

      Object.entries(eventsMapping).forEach(([eventName, contextKey]) => {
        return AccessibilityInfo.removeEventListener(
          eventName as AccessibilityEvents,
          handleAccessibilityInfoChanged(contextKey),
        );
      });
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
