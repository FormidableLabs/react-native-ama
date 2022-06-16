/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  AppState,
  AppStateStatus,
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
    'reactNavigationScreenOptions' | 'trackError' | 'removeError' | '_idRefs'
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
      'reactNavigationScreenOptions' | 'trackError' | '_idRefs' | 'removeError'
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
      // @ts-ignore
      subscriptions.forEach(subscription => subscription.remove());
      AppState.removeEventListener('change', checkAndroidAnimationStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* block:start */
  const [failedItems, setFailedItems] = React.useState<string[]>([]);

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

      items.splice(index);

      return [...items];
    });
  };
  /* block:end */

  return (
    /* block:start */
    __DEV__ ? (
      <AMAContext.Provider
        value={{
          ...values,
          trackError,
          removeError,
        }}>
        <View style={{ flex: 1 }}>
          {children}
          {failedItems.length > 0 ? <AMAError /> : null}
        </View>
      </AMAContext.Provider>
    ) : (
      /* block:end */
      <AMAContext.Provider value={values}>{children}</AMAContext.Provider>
    )
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
  /* block:start */
  trackError: (id: string) => void;
  removeError: (id: string) => void;
  /* block:end */
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
  /* block:start */
  trackError: (_: string) => {},
  removeError: (_: string) => {},
  /* block:end */
};

/* block:start */
const AMAError = () => {
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
};
/* block:end */

const AMAContext = React.createContext<AMAContextValue>(DEFAULT_VALUES);

export const useAMAContext = () => React.useContext(AMAContext);
