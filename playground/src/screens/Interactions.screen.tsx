import * as React from 'react';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Spacer } from '../components/Spacer';
import { Switch } from '../components/Switch';
import { Text } from '../components/Text';
import { theme } from '../theme';

export const InteractionsScreen = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Spacer height="big" />
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1, alignSelf: 'center' }}>Ciaone</Text>
          <Switch
            value={isChecked}
            onValueChange={checked => setIsChecked(checked)}
            label="Test switch"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  textTransform: {
    textTransform: 'uppercase',
  },
  textWithOnPress: {
    marginTop: 12,
    lineHeight: 24,
  },
});
