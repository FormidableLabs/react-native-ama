/* eslint-disable react-native/no-inline-styles */

import { RED } from '@react-native-ama/internal';
import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  NativeEventSubscription,
  Text,
  View,
} from 'react-native';

type AMAProviderProps = {
  children: React.ReactNode;
};

type AccessibilityEvents = Exclude<AccessibilityChangeEventName, 'change'>;

type AccessibilityInfoEvents = {
  [key in AccessibilityEvents]: Exclude<
    keyof AMAContextValue,
    'reactNavigationScreenOptions' | 'trackError' | 'removeError'
  >;
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

  const handleAccessibilityInfoChanged = (
    key: Exclude<
      keyof AMAContextValue,
      'reactNavigationScreenOptions' | 'trackError' | 'removeError'
    >,
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

  const trackError = __DEV__
    ? (id: string) => {
        if (failedItems.includes(id)) {
          return;
        }

        setFailedItems(items => [...items, id]);

        AccessibilityInfo.announceForAccessibility(
          "One or more component didn't pass the accessibility check, please check the console for more info",
        );
      }
    : undefined;

  const removeError = __DEV__
    ? (id: string) => {
        setFailedItems(items => {
          const index = items.indexOf(id);

          if (index >= 0) {
            items.splice(index);

            return [...items];
          }

          return items;
        });
      }
    : undefined;

  return __DEV__ ? (
    <AMAContext.Provider
      value={{
        ...values,
        // @ts-ignore
        trackError,
        // @ts-ignore
        removeError,
      }}>
      <View style={{ flex: 1 }}>
        <>
          {children}
          {
            // @ts-ignore
            failedItems.length > 0 ? (
              <AMAError count={failedItems.length} />
            ) : null
          }
        </>
      </View>
    </AMAContext.Provider>
  ) : (
    <AMAContext.Provider value={values}>{children}</AMAContext.Provider>
  );
};

export type AMAContextValue = {
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

const DEFAULT_VALUES: AMAContextValue = {
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

const AMAError = __DEV__
  ? ({ count }: { count: number }) => {
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
    }
  : null;

const AMAContext = React.createContext<AMAContextValue>(DEFAULT_VALUES);

export const useAMAContext = () => React.useContext(AMAContext);
