import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';
import { Text } from '../components/Text';
import { Form, TextInput } from '@react-native-ama/forms';

export const FormScreen = () => {
  const [emailAddress, setEmailAddress] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const lastNameRef = React.useRef(null);

  return (
    <ScrollView style={styles.view}>
      {/* @ts-ignore */}
      <Form>
        <View>
          <Text style={styles.labelComponent}>First name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(newText) => setFirstName(newText)}
            defaultValue={firstName}
            accessibilityLabel="First Name"
            hasValidation={false}
          />
        </View>

        <Spacer height="normal" />

        <View>
          <Text style={styles.labelComponent}>Last name:</Text>
          {/* @ts-ignore */}
          <TextInput
            style={styles.input}
            onChangeText={(newText) => setLastName(newText)}
            defaultValue={lastName}
            hasValidation={false}
            ref={lastNameRef}
            onBlur={() => {
              // @ts-ignore
              lastNameRef.current?.focus();
            }}
          />
        </View>

        <Spacer height="normal" />

        <View>
          <TextInput
            style={styles.input}
            onChangeText={(newText) => setEmailAddress(newText)}
            defaultValue={emailAddress}
            placeholder="Email address"
            accessibilityLabel="Email address"
            hasValidation={false}
          />
        </View>

        <Spacer height="big" />

        <Form.Submit>
          {({ onPress }) => <CTAPressable onPress={onPress} title="Submit" />}
        </Form.Submit>
      </Form>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
    paddingVertical: theme.padding.big,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  labelComponent: {
    paddingBottom: theme.padding.small,
  },
  switchText: {
    paddingRight: theme.padding.normal,
    flex: 1,
  },
  switchListItem: {
    marginVertical: theme.padding.normal,
  },
  error: {
    color: '#f00',
  },
});
