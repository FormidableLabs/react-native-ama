import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Form, Text, TextInput } from 'react-native-ama';

import { SwitchListItem } from '../../../lib/components/SwitchListItem';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const FormScreen = () => {
  const [text, setText] = React.useState('');
  const [testKeyboardTrap, setTestKeyboardTrap] = React.useState(false);
  const toggleSwitch = () =>
    setTestKeyboardTrap(previousState => !previousState);

  const lastNameRef = React.useRef(null);

  const handleOnSubmit = () => {
    console.info('Form submitted');
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <ScrollView style={styles.view}>
        <TextInput
          style={styles.input}
          placeholder=""
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          label={
            <>
              <Text style={styles.label}>First name:</Text>
            </>
          }
        />

        <Spacer height="normal" />
        <SwitchListItem
          label={
            <Text style={styles.switchText}>
              Test keyboard trap on next field
            </Text>
          }
          style={styles.switchListItem}
          value={testKeyboardTrap}
          onValueChange={toggleSwitch}
        />
        {/*{testKeyboardTrap ? (*/}
        {/*  <>*/}
        {/*    <Text>*/}
        {/*      Note: The following field causes the app to crash when pressing*/}
        {/*      the "next" button on the keyboard*/}
        {/*    </Text>*/}
        {/*    <Spacer height="normal" />*/}
        {/*  </>*/}
        {/*) : null}*/}

        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  placeholder=""*/}
        {/*  defaultValue={text}*/}
        {/*  label={<Text style={styles.label}>Last name:</Text>}*/}
        {/*  ref={lastNameRef}*/}
        {/*  onBlur={() => {*/}
        {/*    // @ts-ignore*/}
        {/*    testKeyboardTrap && lastNameRef.current?.focus();*/}
        {/*  }}*/}
        {/*/>*/}

        {/*<Spacer height="normal" />*/}

        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  placeholder=""*/}
        {/*  defaultValue={text}*/}
        {/*  label={<Text style={styles.label}>Email address:</Text>}*/}
        {/*/>*/}
      </ScrollView>
    </Form>
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
  switchText: {
    paddingRight: theme.padding.normal,
    flex: 1,
  },
  switchListItem: {
    marginVertical: theme.padding.normal,
  },
});
