import { Text, TouchableOpacity } from '@react-native-ama/react-native';
import * as React from 'react';
import {
  AccessibilityState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CTATouchableOpacity } from '../components/CTATouchableOpacity';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const TouchableOpacityScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView style={styles.list}>
        <Spacer height="big" />

        {/*  Disabled */}
        <TouchableOpacityExample state="disabled">
          <CTATouchableOpacity title="This button is 'disabled'" disabled />
        </TouchableOpacityExample>

        {/*  Busy */}
        <TouchableOpacityExample state="busy">
          <CTATouchableOpacity title="This button is 'busy'" busy />
        </TouchableOpacityExample>

        {/*  Checked */}
        <TouchableOpacityExample state="checked">
          <CheckedButton />
        </TouchableOpacityExample>

        {/*  Selected*/}
        <TouchableOpacityExample state="selected">
          <SelectedButton />
        </TouchableOpacityExample>

        {/*  Expanded*/}
        <TouchableOpacityExample state="expanded">
          <ExpandedButton />
        </TouchableOpacityExample>

        {/*  Test rule breakage */}
        <ContrastCheckerFailing />

        {/*  Test minimum size failing  */}
        <MinimumSizeFailing />

        <Spacer height="big" />
      </ScrollView>
    </SafeAreaView>
  );
};

const TouchableOpacityExample: React.FC<{
  state: 'checked' | 'disabled' | 'busy' | 'selected' | 'expanded';
  children: React.ReactNode;
}> = ({ state, children }) => {
  return (
    <>
      <Header title={`Accessibility state: ${state}`} />
      <Spacer height={'normal'} />
      {children}
      <Spacer height={'big'} />
    </>
  );
};

const checkedStates: AccessibilityState['checked'][] = [true, false, 'mixed'];

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
      <CTATouchableOpacity
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
      <CTATouchableOpacity
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
      <CTATouchableOpacity
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

const ContrastCheckerFailing = () => {
  const [activeButton, setActiveButton] = React.useState<
    null | 'all' | 'aa' | 'aaa'
  >(null);

  // @ts-ignore
  const failingStyle = styles[`failingText_${activeButton || ''}`];

  return (
    <>
      <Spacer height={'big'} />
      <Header title="Test 'Contrast checker failing'" />
      <View style={styles.testButtons}>
        <CTATouchableOpacity
          title="ALL"
          accessibilityLabel="All"
          onPress={() => setActiveButton('all')}
          checked={activeButton === 'all'}
        />
        <CTATouchableOpacity
          title="AA"
          accessibilityLabel="A A"
          marginLeft={theme.padding.small}
          marginRight={theme.padding.small}
          onPress={() => setActiveButton('aa')}
          checked={activeButton === 'aa'}
        />
        <CTATouchableOpacity
          title="AAA"
          accessibilityLabel="A A A"
          onPress={() => setActiveButton('aaa')}
          checked={activeButton === 'aaa'}
        />
      </View>
      {activeButton === null ? null : (
        <TouchableOpacity
          style={styles.failingButtonStyle}
          accessibilityRole="button"
          accessibilityLabel="This fails">
          <>
            <Text style={failingStyle}>This fails</Text>
          </>
        </TouchableOpacity>
      )}
    </>
  );
};

const MinimumSizeFailing = () => {
  const [isButtonVisible, setIsButtonVisible] = React.useState(false);

  return (
    <>
      <Spacer height={'big'} />
      <Header title="Test Minimum size failing" />
      <Spacer height="normal" />
      <CTATouchableOpacity
        title="Make it fail"
        onPress={() => setIsButtonVisible(true)}
      />
      {isButtonVisible ? (
        <TouchableOpacity
          style={styles.minSizeFailing}
          accessibilityRole="button"
          accessibilityLabel="This fails">
          <>
            <Text style={{ color: theme.color.white }}>This fails</Text>
          </>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.padding.big,
  },
  checkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkLabel: {
    paddingLeft: theme.padding.normal,
  },
  testButtons: {
    paddingTop: theme.padding.normal,
    flexDirection: 'row',
  },
  failingButtonStyle: {
    backgroundColor: theme.color.black,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.padding.normal,
  },
  failingText_all: {
    color: '#5a5a5a',
  },
  failingText_aa: {
    color: '#c70000',
  },
  failingText_aaa: {
    color: '#FF0000',
  },
  minSizeFailing: {
    backgroundColor: theme.color.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.padding.normal,
    height: 40,
    flex: 1,
  },
});
