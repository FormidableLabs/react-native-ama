/* istanbul ignore file */
import type React from 'react';

import type { FormFieldProps } from './components/FormField';
import { FormField } from './components/FormField';
import { FormSubmit, FormSubmitProps } from './components/FormSubmit';
import { FormProps, Form as FormProvider } from './providers/Form';

// Providers
export { AMAProvider, useAMAContext } from './providers/AMAProvider';

// Components
export * from './components/AnimatedContainer';
export * from './components/AutofocusContainer';
export * from './components/BottomSheet';
export * from './components/DynamicFlatList';
export * from './components/ExpandablePressable';
export * from './components/FlatList';
export * from './components/HideChildrenFromAccessibilityTree';
export * from './components/ListWrapper';
export * from './components/Pressable';
export * from './components/StaticFlatList';
export * from './components/SwitchListItem';
export * from './components/SwitchWrapper';
export * from './components/Text';
export * from './components/TextInput';
export * from './components/TouchableOpacity';
export * from './components/TouchableWithoutFeedback';

// Hooks
export * from './hooks/useFocus';
export * from './hooks/useAnimation';
export * from './hooks/useAnimationDuration';
export * from './hooks/useReanimatedTiming';
export * from './hooks/useFormField';
export * from './hooks/useTimedAction';
export * from './hooks/useSwitch';
export * from './hooks/usePressable';
export * from './hooks/useDynamicList';
export * from './hooks/useExpandable';
export * from './hooks/useTextInput';

// Types
export * from './types';

// Utils
export * from './utils/isMotionAnimation';
export * from './utils/minimumTouchableSize';
export * from './utils/numerify';

// Form
type FormComponent = React.FunctionComponent<FormProps> & {
  Submit: (props: FormSubmitProps) => JSX.Element;
  Field: React.FunctionComponent<FormFieldProps>;
};

// @ts-ignore
export const Form: FormComponent = FormProvider;

Form.Submit = FormSubmit;
Form.Field = FormField;
