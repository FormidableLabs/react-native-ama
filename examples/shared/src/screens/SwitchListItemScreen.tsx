import {
  SwitchListItem,
  Text,
  useSwitch,
} from '@react-native-ama/react-native';
import React, { useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

const getStyles = (value, isError) => {
  return isError
    ? {
        ...styles.touchableOpacityError,
        backgroundColor: value ? '#4CAF50' : 'white',
      }
    : {
        ...styles.touchableOpacity,
        backgroundColor: value ? '#4CAF50' : 'white',
      };
};

const CheckCircle = props => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M10.5 15.25A.74.74 0 0 1 10 15l-3-3a.75.75 0 0 1 1-1l2.47 2.47L19 5a.75.75 0 0 1 1 1l-9 9a.74.74 0 0 1-.5.25"
      />
      <Path
        fill="currentColor"
        d="M12 21a9 9 0 0 1-7.87-4.66a8.7 8.7 0 0 1-1.07-3.41a9 9 0 0 1 4.6-8.81a8.7 8.7 0 0 1 3.41-1.07a8.9 8.9 0 0 1 3.55.34a.75.75 0 1 1-.43 1.43a7.6 7.6 0 0 0-3-.28a7.4 7.4 0 0 0-2.84.89a7.5 7.5 0 0 0-2.2 1.84a7.42 7.42 0 0 0-1.64 5.51a7.4 7.4 0 0 0 .89 2.84a7.5 7.5 0 0 0 1.84 2.2a7.42 7.42 0 0 0 5.51 1.64a7.4 7.4 0 0 0 2.84-.89a7.5 7.5 0 0 0 2.2-1.84a7.42 7.42 0 0 0 1.64-5.51a.75.75 0 1 1 1.57-.15a9 9 0 0 1-4.61 8.81A8.7 8.7 0 0 1 12.93 21z"
      />
    </Svg>
  );
};

const Circle = props => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      />
    </Svg>
  );
};
const CustomSwitch = ({ value, onValueChange, isError = false }) => {
  const props = useSwitch({
    accessibilityLabel: 'My Switch',
    style: getStyles(value, isError),
  });
  return (
    <TouchableOpacity onPress={onValueChange} {...props}>
      {value ? <CheckCircle color={'black'} /> : <Circle color={'grey'} />}
    </TouchableOpacity>
  );
};

export const SwitchListItemScreen = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isCustomSwitchOn, setCustomIsSwitchOn] = useState(false);
  const [isErrorCustomSwitchOn, setErrorCustomIsSwitchOn] = useState(false);
  const [showTouchableAreaError, setShowTouchableAreaError] = useState(false);
  const toggleRNSwitch = () => {
    setIsSwitchOn(previousState => !previousState);
  };

  const toggleCustomSwitch = () => {
    setCustomIsSwitchOn(previousState => !previousState);
  };

  const toggleErrorCustomSwitch = () => {
    setErrorCustomIsSwitchOn(previousState => !previousState);
  };

  return (
    <View style={styles.view}>
      <Text style={styles.intro}>
        This example shows how to use the{' '}
        <Text
          accessibilityRole="link"
          style={styles.underline}
          onPress={() =>
            Linking.openURL(
              'https://commerce.nearform.com/open-source/react-native-ama/react-native/SwitchListItem',
            )
          }>
          SwitchListItem.
        </Text>
      </Text>
      <View style={styles.container}>
        <SwitchListItem
          accessibilityLabel={'Accessible React Native Switch'}
          labelComponent={
            <Text style={styles.switchText}>React Native Switch</Text>
          }
          style={styles.switchListItem}
          value={isSwitchOn}
          onValueChange={toggleRNSwitch}
        />
        <SwitchListItem
          accessibilityLabel={'Accessible Custom Switch '}
          labelComponent={
            <Text style={styles.switchText}>
              Custom Switch with{'\n'}
              <Text style={styles.switchText}>height:46px{'\n'}</Text>
              <Text style={styles.switchText}>width:46px{'\n'}</Text>
              <Text style={styles.switchText}>and no error</Text>
            </Text>
          }
          style={styles.switchListItem}
          value={isCustomSwitchOn}
          onValueChange={toggleCustomSwitch}>
          <CustomSwitch
            value={isCustomSwitchOn}
            onValueChange={toggleCustomSwitch}
          />
        </SwitchListItem>
        <Spacer height="big" />

        <CTAPressable
          title="Show error example "
          disabled={showTouchableAreaError}
          onPress={() => setShowTouchableAreaError(true)}
        />
        {showTouchableAreaError ? (
          <>
            <Spacer height="normal" />
            <Text>Custom Switch with breaking guidelines: </Text>
            <SwitchListItem
              labelComponent={
                <Text style={styles.switchText}>
                  Custom Switch{'\n'}
                  <Text style={styles.switchText}>height:40px{'\n'}</Text>
                  <Text style={styles.switchText}>width:40px{'\n'}</Text>
                </Text>
              }
              style={styles.switchListItem}
              value={isErrorCustomSwitchOn}
              onValueChange={toggleErrorCustomSwitch}>
              <CustomSwitch
                value={isErrorCustomSwitchOn}
                onValueChange={toggleErrorCustomSwitch}
                isError
              />
            </SwitchListItem>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  container: {
    paddingHorizontal: theme.padding.normal,
    paddingTop: theme.padding.normal,
  },
  intro: {
    lineHeight: theme.lineHeight.medium,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  labelComponent: {
    paddingBottom: theme.padding.small,
  },
  switchText: {
    flex: 1,
    paddingRight: theme.padding.normal,
  },
  switchListItem: {
    marginVertical: theme.padding.normal,
  },
  touchableOpacity: {
    width: 46,
    height: 46,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacityError: {
    width: 40,
    height: 40,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
