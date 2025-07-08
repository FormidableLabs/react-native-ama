import { Pressable, Text } from '@react-native-ama/react-native';
import * as React from 'react';
import {
  AccessibilityState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const PressableScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView style={styles.list}>
        <Spacer height="big" />
        <Header title={'Accessibility Checks'} />
        <Text>
          This screen displays the accessibility checks AMA can perform on
          pressable elements:
        </Text>
        <CTAPressable title="Missing role" role="" />
        <Spacer height={'normal'} />

        {/*  Disabled */}
        <CTAPressable title="This button is 'disabled'" disabled />
        <Spacer height={'normal'} />

        {/*  Busy */}
        <CTAPressable title="This button is 'busy'" busy />
        <Spacer height={'normal'} />

        {/*  Checked */}
        <CheckedButton />
        <Spacer height={'normal'} />

        {/*  Selected*/}
        <SelectedButton />
        <Spacer height={'normal'} />

        {/*  Expanded*/}
        <ExpandedButton />
        <Spacer height={'normal'} />

        {/*  Test rule breakage */}
        <ContrastCheckerFailing />

        {/*  Test minimum size failing  */}
        <MinimumSizeFailing />

        <Spacer height={'big'} />
      </ScrollView>
    </SafeAreaView>
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
      <CTAPressable
        title="Checked status"
        checked={state}
        onPress={nextState}
      />
      <Text
        style={styles.checkLabel}
        accessibilityElementsHidden
        importantForAccessibility={'no'}
      >{`${state}`}</Text>
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
        importantForAccessibility={'no'}
      >{`${state}`}</Text>
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
        importantForAccessibility={'no'}
      >{`${state}`}</Text>
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
        <CTAPressable
          title="ALL"
          accessibilityLabel="All"
          onPress={() => setActiveButton('all')}
          checked={activeButton === 'all'}
        />
        <CTAPressable
          title="AA"
          accessibilityLabel="A A"
          marginLeft={theme.padding.small}
          marginRight={theme.padding.small}
          onPress={() => setActiveButton('aa')}
          checked={activeButton === 'aa'}
        />
        <CTAPressable
          title="AAA"
          accessibilityLabel="A A A"
          onPress={() => setActiveButton('aaa')}
          checked={activeButton === 'aaa'}
        />
      </View>
      {activeButton === null ? null : (
        <Pressable
          style={styles.failingButtonStyle}
          accessibilityRole="button"
          accessibilityLabel="This fails"
        >
          <>
            <Text style={failingStyle}>
              `This fails {activeButton.toUpperCase()} level`
            </Text>
          </>
        </Pressable>
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
      <CTAPressable
        title="Make it fail"
        onPress={() => setIsButtonVisible(true)}
      />
      {isButtonVisible ? (
        <>
          <Spacer height="normal" />
          <Pressable
            style={styles.minSizeFailing}
            accessibilityRole="button"
            accessibilityLabel="This fails"
          >
            <Text style={{ color: theme.color.white }}>This fails</Text>
          </Pressable>
        </>
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
    color: '#525252',
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
