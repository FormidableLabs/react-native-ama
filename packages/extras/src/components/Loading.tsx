import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props = {
  isLoading: boolean;
  title?: string;
  activityIndicatorProps?: React.ComponentProps<typeof ActivityIndicator>;
};

export const Loading = ({
  isLoading,
  title,
  activityIndicatorProps,
}: Props) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" {...activityIndicatorProps} />
      <Text style={styles.text}>{title ?? 'Loading...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    marginBottom: 40,
  },
});
