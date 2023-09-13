import { StyleSheet, Text, View } from 'react-native';
import { greeting } from 'test-package-greeting';

export const HomeScreen = () => {
  return (
    <View style={styles.view}>
      <Text>{greeting}</Text>
    </View>
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
