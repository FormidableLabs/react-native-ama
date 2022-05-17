import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const TextScreen = () => {
  const [showTextTransformExample, setShowTextTransformExample] =
    React.useState(false);
  const [
    showTextAllCAPSAccessibilityLabel,
    setShowTextAllCAPSAccessibilityLabel,
  ] = React.useState(false);

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text>
          This screen header "Text Demo" gets autofocused by the SR because its
          `autofocus` property is set to true
        </Text>
        <Spacer height="big" />
        <Header title="Text text with `textTransform: uppercase` property and no accessibilityLabel" />
        <Spacer height="normal" />
        <CTAPressable
          title="Show text transform example"
          onPress={() => setShowTextTransformExample(true)}
        />
        {showTextTransformExample ? (
          <Text style={styles.textTransform}>Text goes here</Text>
        ) : null}

        <Spacer height="normal" />
        <Header title="Text all CAPS accessibilityLabel" />
        <Spacer height="normal" />
        <CTAPressable
          title="Show all CAPS example"
          onPress={() => setShowTextAllCAPSAccessibilityLabel(true)}
        />
        {showTextAllCAPSAccessibilityLabel ? (
          <Text accessibilityLabel="ALL CAPS">All caps</Text>
        ) : null}
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
});
