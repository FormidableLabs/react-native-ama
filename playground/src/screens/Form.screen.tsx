import * as React from "react";
import { ScrollView, StyleSheet,  View } from "react-native";

import { CTAPressable } from "../components/CTAPressable";
import { Spacer } from "../components/Spacer";
import { theme } from "../theme";
import { Text } from "../components/Text";
import { Form, TextInput } from "@react-native-ama/forms";

export const FormScreen = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  return (
    <ScrollView style={styles.view}>
		<Form>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={(newText) => setFirstName(newText)}
          defaultValue={firstName}
          accessibilityLabel="First Name"
					hasValidation={false}
					labelComponent={<Text style={styles.labelComponent}>First name:</Text>}
        />
      </View>

      <Spacer height="normal" />

      <View>
        <Text style={styles.labelComponent}>Last name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(newText) => setLastName(newText)}
          defaultValue={lastName}
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
        />
      </View>

      <Spacer height="big" />

      <CTAPressable title="Submit" />
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
