/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { RED } from '../internal/error.style';
import { areAnimationsEnabled } from '../modules/AMAAnimationsStatusModule';

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
  const appState = React.useRef('inactive');

  const handleAccessibilityInfoChanged = (
    key: Exclude<
      keyof AMAContextValue,
      'reactNavigationScreenOptions' | 'trackError' | 'removeError'
    >,
  ) => {
    return (newValue: boolean) => {
      const newValues = { ...values };
      newValues[key] = newValue;

      if (key === 'isReduceMotionEnabled') {
        newValues.reactNavigationScreenOptions.animationEnabled = !newValue;
        newValues.reactNavigationScreenOptions.animation = newValue
          ? 'fade'
          : 'default';
      }

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

    if (Platform.OS === 'android') {
      subscriptions.push(
        AppState.addEventListener('change', checkAndroidAnimationStatus),
      );

      checkAndroidAnimationStatus('active');
    }

    Promise.all(allInitPromises).then(promisesValues => {
      const newValues = Object.values(eventsMapping).reduce(
        (list, key, index) => {
          list[key] = promisesValues[index];

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
      subscriptions.forEach(subscription => subscription.remove());
      AppState.removeEventListener('change', checkAndroidAnimationStatus);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          items.splice(index);

          return [...items];
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
            failedItems.length > 0 ? <AMAError /> : null
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
  trackError: (id: string) => void;
  removeError: (id: string) => void;
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
  trackError: (_: string) => {},
  removeError: (_: string) => {},
};

const AMAError = __DEV__
  ? () => {
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="One or more components didn't pass the accessibility check"
          accessibilityHint="Please check the console for more info..."
          style={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 48,
            backgroundColor: RED,
          }}>
          <View accessible={true}>
            <Text style={{ color: 'white', fontSize: 16, lineHeight: 26 }}>
              AMA: One or more component didn't pass the accessibility check.
            </Text>
            <Text style={{ color: 'white', fontSize: 16, lineHeight: 24 }}>
              Please check the console for more info...
            </Text>
          </View>
        </Pressable>
      );
    }
  : null;

const AMAContext = React.createContext<AMAContextValue>(DEFAULT_VALUES);

export const useAMAContext = () => React.useContext(AMAContext);
