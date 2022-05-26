import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-ama';

import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const FormScreen = () => {
  const [text, setText] = React.useState('');
  const lastNameRef = React.useRef(null);
  const emailRef = React.useRef(null);

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.input}
        placeholder=""
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        label={<Text style={styles.label}>First name:</Text>}
        returnKeyType="next"
        nextTextInput={lastNameRef}
      />

      <Spacer height="normal" />
      <Text>
        Note: The following field causes the app to crash when pressing the
        "next" button on the keyboard
      </Text>
      <TextInput
        style={styles.input}
        placeholder=""
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        label={<Text style={styles.label}>Last name:</Text>}
        returnKeyType="next"
        nextTextInput={emailRef}
        ref={lastNameRef}
        onBlur={() => {
          // @ts-ignore
          lastNameRef.current?.focus();
        }}
      />

      <Spacer height="normal" />

      <TextInput
        style={styles.input}
        placeholder=""
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        label={<Text style={styles.label}>Email address:</Text>}
        returnKeyType="done"
        ref={emailRef}
      />
    </View>
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
  label: {
    paddingBottom: theme.padding.small,
  },
});
