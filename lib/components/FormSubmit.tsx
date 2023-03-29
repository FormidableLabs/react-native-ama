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
  const { submitForm } = useForm();

  const { isScreenReaderEnabled } = useAMAContext();

  return (
    <Pressable accessibilityRole="button" {...props} onPress={submitForm}>
      {isScreenReaderEnabled ? (
        <FormSubmitForScreenReader {...props} />
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
    <View pointerEvents="none">
      <HideChildrenFromAccessibilityTree>
        {children}
      </HideChildrenFromAccessibilityTree>
    </View>
  );
};
