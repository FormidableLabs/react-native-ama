import React from 'react';
import { PressableProps, View } from 'react-native';

import { useForm } from '../providers/Form';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';
import { Pressable } from './Pressable';

export type FormSubmitProps = React.PropsWithChildren<{
  accessibilityLabel: string;
  accessibilityHint?: string;
  busy: boolean;
  style?: PressableProps['style'];
}>;

export const FormSubmit = ({ children, ...rest }: FormSubmitProps) => {
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
