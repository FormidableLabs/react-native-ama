import React from 'react';
import { PressableProps, View } from 'react-native';

import { useAMAContext } from '../providers/AMAProvider';
import { useForm } from '../providers/Form';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';
import { Pressable } from './Pressable';

export type FormSubmitProps = React.PropsWithChildren<{
  accessibilityLabel: string;
  accessibilityHint?: string;
  busy: boolean;
  style?: PressableProps['style'];
  testID?: string;
}>;

export const FormSubmit = (props: FormSubmitProps) => {
  const { isScreenReaderEnabled } = useAMAContext();

  return isScreenReaderEnabled ? (
    <FormSubmitForScreenReader {...props} />
  ) : (
    <>{props.children}</>
  );
};

const FormSubmitForScreenReader = ({ children, ...rest }: FormSubmitProps) => {
  const { submitForm } = useForm();

  return (
    <Pressable accessibilityRole="button" {...rest} onPress={submitForm}>
      <View pointerEvents="none">
        <HideChildrenFromAccessibilityTree>
          {children}
        </HideChildrenFromAccessibilityTree>
      </View>
    </Pressable>
  );
};
