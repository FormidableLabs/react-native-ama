import { SwitchListItem, Text } from '@react-native-ama/react-native';
import React, { useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

const getStyles = value => {
  return {
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
const CustomSwitch = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={onValueChange} style={getStyles(value)}>
      {value ? (
        <CheckCircle size={25} color={'black'} />
      ) : (
        <Circle size={25} color={'grey'} />
      )}
    </TouchableOpacity>
  );
};

export default CustomSwitch;
export const SwitchListItemScreen = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isCustomSwitchOn, setCustomIsSwitchOn] = useState(false);
  const toggleRNSwitch = () => {
    setIsSwitchOn(previousState => !previousState);
  };

  const toggleCustomSwitch = () => {
    setCustomIsSwitchOn(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <Spacer height="big" />
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
      <View style={styles.view}>
        <SwitchListItem
          accessibilityLabel={'Accessible React Native Switch'}
          labelComponent={
            <Text style={styles.switchText}>I'm a React Native Switch</Text>
          }
          style={styles.switchListItem}
          value={isSwitchOn}
          onValueChange={toggleRNSwitch}
        />
        <SwitchListItem
          accessibilityLabel={'Accessible Custom Switch'}
          labelComponent={
            <Text style={styles.switchText}>I'm a Custom Switch</Text>
          }
          style={styles.switchListItem}
          value={isCustomSwitchOn}
          onValueChange={toggleCustomSwitch}>
          <CustomSwitch
            value={isCustomSwitchOn}
            onValueChange={toggleCustomSwitch}
          />
        </SwitchListItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.padding.normal,
    paddingTop: theme.padding.normal,
  },
  intro: {
    lineHeight: theme.lineHeight.medium,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  view: {
    paddingHorizontal: theme.padding.normal,
    paddingVertical: theme.padding.normal,
  },
  labelComponent: {
    paddingBottom: theme.padding.small,
  },
  switchText: {
    paddingRight: theme.padding.normal,
  },
  switchListItem: {
    marginVertical: theme.padding.normal,
  },
  touchableOpacity: {
    borderRadius: 100,
    padding: 10,
  },
});
