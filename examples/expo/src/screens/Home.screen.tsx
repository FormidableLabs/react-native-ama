import { StyleSheet, Text, View } from 'react-native';

export const HomeScreen = () => {
  return <View style={styles.view}></View>;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    // paddingVertical: theme.padding.normal, // Add shared theme
  },
});
