/* eslint-disable react-native/no-inline-styles */

import { RED } from '@react-native-ama/internal';
import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  NativeEventSubscription,
  Platform,
  Text,
  View,
} from 'react-native';

import { AMAWrapper } from './AMAWrapper';

type AMAProviderProps = {
  children: React.ReactNode;
};

type SharedContextValue = {
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
export type AMADevContextValue = SharedContextValue & {
  trackError: (id: string) => void;
  removeError: (id: string) => void;
};

export type AMAProdContextValue = SharedContextValue & {};

export type AMAContextValue = AMADevContextValue | AMAProdContextValue;

type AccessibilityEvents = Exclude<AccessibilityChangeEventName, 'change'>;

type AccessibilityInfoKey = Exclude<
  keyof AMAContextValue,
  'reactNavigationScreenOptions' | 'trackError' | 'removeError'
>;

type Extractor<S extends AccessibilityEvents> = S extends `${infer R}Changed`
  ? R
  : never;

type AccessibilityInfoEvents = {
  [key in AccessibilityEvents]: `is${Capitalize<Extractor<key>>}Enabled`;
};

const eventsMapping: AccessibilityInfoEvents = {
  reduceTransparencyChanged: 'isReduceTransparencyEnabled',
  reduceMotionChanged: 'isReduceMotionEnabled',
  grayscaleChanged: 'isGrayscaleEnabled',
  boldTextChanged: 'isBoldTextEnabled',
  invertColorsChanged: 'isInvertColorsEnabled',
  screenReaderChanged: 'isScreenReaderEnabled',
};

export const isDevContextValue = (
  value: AMAContextValue,
): value is AMADevContextValue =>
  (value as AMADevContextValue).trackError !== undefined;

const DEFAULT_VALUES = {
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
} satisfies AMAContextValue;

const AMAContext = React.createContext<AMAContextValue | null>(null);

export const AMAProvider: React.FC<AMAProviderProps> = ({ children }) => {
  const [values, setValues] = React.useState<AMAContextValue>(DEFAULT_VALUES);

  const handleAccessibilityInfoChanged = (key: AccessibilityInfoKey) => {
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
      eventsMapping,
    ).map(([eventName, contextKey]) => {
      allInitPromises.push(AccessibilityInfo[contextKey]());

      return AccessibilityInfo.addEventListener(
        eventName as AccessibilityEvents,
        handleAccessibilityInfoChanged(contextKey),
      );
    });

    Promise.all(allInitPromises).then(promisesValues => {
      const newValues = Object.values(eventsMapping).reduce(
        (list, key, index) => {
          list[key] = promisesValues[index] as boolean;

          return list;
        },
        {} as AMAContextValue,
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

  const [failedItems, setFailedItems] = React.useState<string[]>([]);

  if (__DEV__) {
    const trackError = (id: string) => {
      if (failedItems.includes(id)) {
        return;
      }

      setFailedItems(items => [...items, id]);

      AccessibilityInfo.announceForAccessibility(
        "One or more component didn't pass the accessibility check, please check the console for more info",
      );
    };

    const removeError = (id: string) => {
      setFailedItems(items => {
        const index = items.indexOf(id);

        if (index >= 0) {
          items.splice(index);

          return [...items];
        }

        return items;
      });
    };

    return (
      <AMAWrapper>
        <AMAContext.Provider
          value={{
            ...values,
            trackError,
            removeError,
          }}>
          <View style={{ flex: 1 }}>
            <>
              {children}
              {failedItems.length > 0 ? (
                <AMAError count={failedItems.length} />
              ) : null}
            </>
          </View>
        </AMAContext.Provider>
      </AMAWrapper>
    );
  }

  return <AMAContext.Provider value={values}>{children}</AMAContext.Provider>;
};

const AMAError = ({ count }: { count: number }) => {
  const error = `${count} component(s) didn't pass the accessibility check(s)`;

  return (
    <View
      accessibilityLabel={error}
      accessibilityHint="Please check the console for more info..."
      style={{
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 48,
        backgroundColor: RED,
      }}
      testID="amaError">
      <View accessible={true}>
        <Text
          style={{ color: 'white', fontSize: 16, lineHeight: 26 }}
          testID="amaError.message">
          {error}
        </Text>
        <Text style={{ color: 'white', fontSize: 16, lineHeight: 24 }}>
          Please check the console for more info...
        </Text>
      </View>
    </View>
  );
};

export const useAMAContext = () => {
  const context = React.useContext(AMAContext);
  if (!context) {
    throw new Error('Please wrap your app with <AMAProvider />');
  }

  return context;
};
