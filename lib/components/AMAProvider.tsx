import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

type AMAProviderProps = {
  children: React.ReactNode;
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
    const subscriptions = [
      AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        handleAccessibilityInfoChanged('reduceMotion'),
      ),
      AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        handleAccessibilityInfoChanged('screenReaderEnabled'),
      ),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AMAContext.Provider value={values}>{children}</AMAContext.Provider>;
};

export type AMAContextValue = {
  screenReaderEnabled: boolean;
  reduceMotion: boolean;
};

const DEFAULT_VALUES: AMAContextValue = {
  screenReaderEnabled: false,
  reduceMotion: false,
};

const AMAContext = React.createContext<AMAContextValue>(DEFAULT_VALUES);

export const useAMAContext = () => React.useContext(AMAContext);
