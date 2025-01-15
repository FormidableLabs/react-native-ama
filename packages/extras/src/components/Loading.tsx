import {
  AutofocusContainer,
  AutofocusContainerProps,
} from '@react-native-ama/core';
import * as React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

type Props = {
  isLoading: boolean;
  title?: string;
  showTitle?: boolean;
  style?: StyleProp<ViewStyle>;
  containerProps?: Omit<AutofocusContainerProps, 'children'>;
  activityIndicatorProps?: React.ComponentProps<typeof ActivityIndicator>;
};

export const Loading = ({
  isLoading,
  title,
  style,
  containerProps,
  showTitle = true,
  activityIndicatorProps,
}: Props) => {
  if (!isLoading) {
    return null;
  }
  return (
    <AutofocusContainer
      style={[styles.container, style]}
      accessibilityState={{ busy: true }}
      accessibilityLabel={title ?? 'Loading'}
      {...containerProps}>
      <ActivityIndicator
        size="large"
        style={styles.indicator}
        {...activityIndicatorProps}
      />
      {showTitle ? (
        <Text style={styles.text}>{title ?? 'Loading...'}</Text>
      ) : null}
    </AutofocusContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  indicator: {
    alignSelf: 'center',
  },
  text: {
    marginTop: 10,
    marginBottom: 40,
  },
});
