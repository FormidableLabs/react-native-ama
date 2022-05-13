import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { AMAAccessibilityState } from 'react-native-ama';
import { Text } from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const PressableScreen = () => {
  return (
    <ScrollView style={styles.list}>
      {/*  Disabled */}
      <PressableExample state="disabled">
        <CTAPressable title="This button is 'disabled'" disabled />
      </PressableExample>

      {/*  Busy */}
      <PressableExample state="busy">
        <CTAPressable title="This button is 'busy'" busy />
      </PressableExample>

      {/*  Checked */}
      <PressableExample state="checked">
        <CheckedButton />
      </PressableExample>

      {/*  Selected*/}
      <PressableExample state="selected">
        <SelectedButton />
      </PressableExample>

      {/*  Expanded*/}
      <PressableExample state="expanded">
        <ExpandedButton />
      </PressableExample>
    </ScrollView>
  );
};

const PressableExample: React.FC<{ state: keyof AMAAccessibilityState }> = ({
  state,
  children,
}) => {
  return (
    <>
      <Header title={`Accessibility state: ${state}`} />
      <Spacer height={'normal'} />
      {children}
      <Spacer height={'big'} />
    </>
  );
};

const checkedStates: AMAAccessibilityState['checked'][] = [
  true,
  false,
  'mixed',
];

const CheckedButton = () => {
  const [state, setState] = React.useState(checkedStates[0]);

  const nextState = () => {
    const stateIndex = checkedStates.indexOf(state);
    const nextIndex =
      stateIndex === checkedStates.length - 1 ? 0 : stateIndex + 1;

    setState(checkedStates[nextIndex]);
  };

  return (
    <View style={styles.checkButton}>
      <CTAPressable
        title="Checked status"
        checked={state}
        onPress={nextState}
      />
      <Text
        style={styles.checkLabel}
        accessibilityElementsHidden
        importantForAccessibility={'no'}>{`${state}`}</Text>
    </View>
  );
};

const SelectedButton = () => {
  const [state, setState] = React.useState(true);

  const nextState = () => {
    setState(isSelected => !isSelected);
  };

  return (
    <View style={styles.checkButton}>
      <CTAPressable
        title="Selected status"
        selected={state}
        onPress={nextState}
      />
      <Text
        style={styles.checkLabel}
        accessibilityElementsHidden
        importantForAccessibility={'no'}>{`${state}`}</Text>
    </View>
  );
};

const ExpandedButton = () => {
  const [state, setState] = React.useState(true);

  const nextState = () => {
    setState(isExpanded => !isExpanded);
  };

  return (
    <View style={styles.checkButton}>
      <CTAPressable
        title="Expanded status"
        expanded={state}
        onPress={nextState}
      />
      <Text
        style={styles.checkLabel}
        accessibilityElementsHidden
        importantForAccessibility={'no'}>{`${state}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  checkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkLabel: {
    paddingLeft: theme.padding.normal,
  },
});
