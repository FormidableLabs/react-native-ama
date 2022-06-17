import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ExpandablePressable, Text } from 'react-native-ama';

import { theme } from '../theme';

export const ExpandablePressableScreen = () => {
  const [isContentVisible, setIsContentVisible] = React.useState(false);

  const handleOnPress = () => {
    setIsContentVisible(visible => !visible);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ExpandablePressable
        accessibilityLabel={'Toggle content'}
        expanded={isContentVisible}
        onPress={handleOnPress}
        style={styles.button}>
        <Text>Toggle content</Text>
      </ExpandablePressable>
      {isContentVisible ? (
        <Text>This is the content of the expanded element</Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.padding.big,
  },
  button: {
    paddingVertical: theme.padding.big,
  },
});
