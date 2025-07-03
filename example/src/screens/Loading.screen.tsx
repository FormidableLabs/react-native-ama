import { Loading } from '@react-native-ama/extras';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { theme } from '../theme';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // onMount set isLoading to true
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <CTAPressable
        title="Trigger Loading"
        onPress={triggerLoading}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
});
