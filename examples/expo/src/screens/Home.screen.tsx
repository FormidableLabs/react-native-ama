import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export const HomeScreen = () => {
  const [isDoingSomething, setIsDoingSomething] = React.useState(false);

  return (
    <Pressable
      onPress={() => setIsDoingSomething(true)}
      accessibilityState={{ busy: isDoingSomething }}
      accessibilityRole="button"
      accessibilityLabel="Press me"
    >
      <Text>Press me!!</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: theme.padding.normal, // Add shared theme
  },
});
