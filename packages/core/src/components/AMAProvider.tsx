import * as React from 'react';
import {
    AccessibilityChangeEventName,
    AccessibilityInfo,
    LogBox,
    NativeEventSubscription,
    View,
} from 'react-native';
import { useAMADev } from '../hooks/useAMADev';
import { AMAError } from './AMAError';


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

LogBox.ignoreAllLogs();

export const AMAProvider: React.FC<AMAProviderProps> = ({ children }) => {
    const [values, setValues] = React.useState<AMAContextValue>(DEFAULT_VALUES);

    const { issues } = __DEV__ && useAMADev() || {};

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

    if (__DEV__) {
        return (
            <AMAContext.Provider
                value={{
                    ...values,
                }}>
                <View style={{ flex: 1 }}>
                    <>
                        {children}
                        <AMAError issues={issues} />
                    </>
                </View>
            </AMAContext.Provider>
        );
    }

    return <AMAContext.Provider value={values}>{children}</AMAContext.Provider>;
};


export const useAMAContext = () => {
    const context = React.useContext(AMAContext);
    if (!context) {
        throw new Error('Please wrap your app with <AMAProvider />');
    }

    return context;
};
