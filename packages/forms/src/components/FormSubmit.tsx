import {
  HideChildrenFromAccessibilityTree,
  useAMAContext,
} from '@react-native-ama/core';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { useForm } from '../components/Form';

export type FormSubmitProps = React.PropsWithChildren<{
  accessibilityLabel: string;
  accessibilityHint?: string;
  busy: boolean;
  style?: PressableProps['style'];
  testID?: string;
}>;

export const FormSubmit = (props: FormSubmitProps) => {
  const { submitForm } = useForm();
  const { isScreenReaderEnabled } = useAMAContext();

  return (
    <Pressable
      accessibilityRole="button"
      pointerEvents="box-only" // prevent event propagation to children eg Pressable
      {...props}
      onPress={submitForm}
    >
      {isScreenReaderEnabled ? (
        <FormSubmitForScreenReader children={props.children} />
      ) : (
        props.children
      )}
    </Pressable>
  );
};

const FormSubmitForScreenReader = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return (
    <HideChildrenFromAccessibilityTree>
      {children}
    </HideChildrenFromAccessibilityTree>
  );
};
