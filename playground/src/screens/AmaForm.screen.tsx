import { Form, type FormActions, TextInput } from "@react-native-ama/forms";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { CTAPressable } from "../components/CTAPressable";
import { Spacer } from "../components/Spacer";
import { theme } from "../theme";
import { Text } from "../components/Text";

export const AmaFormScreen = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [testKeyboardTrap, setTestKeyboardTrap] = React.useState(false);
  const formRef = React.useRef<FormActions>(null);
  const [invalidFields, setInvalidFields] = React.useState<{
    lastName: boolean;
    firstName: boolean;
  }>({ firstName: false, lastName: false });

  const toggleSwitch = () =>
    setTestKeyboardTrap((previousState) => !previousState);

  const lastNameRef = React.useRef(null);

  const handleOnSubmit = () => {
    console.log("handleOnSubmit");
    const hasErrors = firstName.length === 0 || lastName.length === 0;

    setInvalidFields({
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
    });

    return !hasErrors;
  };

  return (
    <ScrollView style={styles.view}>
      <Form onSubmit={handleOnSubmit} ref={formRef}>
        <TextInput
          style={styles.input}
          placeholder=""
          accessibilityLabel="First name"
          onChangeText={(newText) => setFirstName(newText)}
          defaultValue={firstName}
          hasValidation={true}
          hasError={invalidFields.firstName}
          renderLabel={(a11yProps) =>
            <Text style={styles.labelComponent} {...a11yProps} >First name:</Text>
          }
        />

        <Spacer height="normal" />
        <Text style={styles.switchText}>Test keyboard trap on next field</Text>
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
          aria-label="Last name"
          defaultValue={lastName}
          onChangeText={(newText) => setLastName(newText)}
          hasValidation={true}
          renderLabel={(a11yProps) =>
            <Text style={styles.labelComponent} {...a11yProps}>Last name:</Text>
          }
          renderError={(a11yProps) =>
            <Text style={styles.error} {...a11yProps}>The thing cannot be null</Text>
          }
          hasError={invalidFields.lastName}
          ref={lastNameRef}
          onBlur={() => {
            // @ts-ignore
            testKeyboardTrap && lastNameRef.current?.focus();
          }}
        />

        <Spacer height="normal" />

        <TextInput
          style={styles.input}
          placeholder=""
          accessibilityLabel="Email address"
          defaultValue={emailAddress}
          renderLabel={(a11yProps) =>
            <Text style={styles.labelComponent} {...a11yProps}>Email address:</Text>
          }
          onChangeText={(newText) => setEmailAddress(newText)}
          hasValidation={false}
        />
        <Spacer height="big" />
        <Form.Submit accessibilityLabel="Submit" busy={false}>
          <CTAPressable title="Submit" />
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
    color: "#f00",
  },
});
