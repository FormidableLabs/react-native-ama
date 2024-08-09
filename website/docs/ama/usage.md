---
displayed_sidebar: docs
---

# Usage

## Installation

```bash npm2yarn
npm install -D react-native-ama
```

## The provider

You need to add the [AMAProvider](../components/AMAProvider) to your app as is needed by some components/hooks.

```jsx {1-4,8-9}
import { AMAProvider } from 'react-native-ama';

const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```

## Example

In the following Example the navigation animation are disabled when the user enables the [Reduce Motion](../guidelines/animations) setting.

It also shows how to build a more accessible [form](../guidelines/forms) using the built-in components.

```jsx
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AMAProvider, useAMAContext, Form, SwitchListItem, Text, TextInput } from 'react-native-ama'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AMAProvider>
      <AppNavigator />
    </AMAProvider>
  );
};

const AppNavigator = () => {
  const { reactNavigationScreenOptions } = useAMAContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...reactNavigationScreenOptions,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <Text autofocus title={'The header'} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const HomeScreen = () => {
  const [emailAddress, setEmailAddress] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [testKeyboardTrap, setTestKeyboardTrap] = React.useState(false);
  const [invalidFields, setInvalidFields] = React.useState<{
    lastName: boolean;
    firstName: boolean;
  }>({ firstName: false, lastName: false });

  const toggleSwitch = () =>
    setTestKeyboardTrap(previousState => !previousState);

  const lastNameRef = React.useRef(null);

  const handleOnSubmit = () => {
    setInvalidFields({
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
    });
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <ScrollView style={styles.view}>
        <TextInput
          style={styles.input}
          placeholder=""
          onChangeText={newText => setFirstName(newText)}
          defaultValue={firstName}
          label={
            <>
              <Text style={styles.label}>First name:</Text>
            </>
          }
          hasValidation={true}
          error={<Text>The first name cannot be blank</Text>}
          hasError={invalidFields.firstName}
        />

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
        {testKeyboardTrap ? (
          <>
            <Text>
              Note: The following field causes the app to crash when pressing
              the "next" button on the keyboard
            </Text>
            <Spacer height="normal" />
          </>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder=""
          defaultValue={lastName}
          label={<Text style={styles.label}>Last name:</Text>}
          onChangeText={newText => setLastName(newText)}
          hasValidation={true}
          error={<Text>The thing cannot be null</Text>}
          hasError={invalidFields.lastName}
          ref={lastNameRef}
          onBlur={() => {
            testKeyboardTrap && lastNameRef.current?.focus();
          }}
        />

        <TextInput
          style={styles.input}
          placeholder=""
          defaultValue={emailAddress}
          label={<Text style={styles.label}>Email address:</Text>}
          onChangeText={newText => setEmailAddress(newText)}
          hasValidation={false}
        />
        <Pressable
            onPress={handleOnSubmit}
            accessibilityLabel="Submit"
            accessibiltiyRole="button"
        >
            <Text>Submit</Text>
        </Pressable>
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

export default App;
```
