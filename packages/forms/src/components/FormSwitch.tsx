import {
  SwitchListItem,
  type SwitchListItemProps,
} from '@react-native-ama/react-native';
import React from 'react';
import { FormField } from './FormField';

export type FormSwitchProps = SwitchListItemProps;

export const FormSwitch = (props: FormSwitchProps) => {
  return (
    <FormField hasValidation={false}>
      <SwitchListItem {...props} />
    </FormField>
  );
};
