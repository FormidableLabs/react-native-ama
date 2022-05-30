import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextInputSubmitEditingEventData,
} from 'react-native';

import { useFormField } from '../hooks/useFormField';
import { generateAccessibilityLabelFromLabel } from '../internal/generateAccessibilityLabelFromLabel';

export type TextInputProps = RNTextInputProps & {
  label: JSX.Element;
  labelPosition?: 'beforeInput' | 'afterInput';
} & {
  nextFormField?: React.RefObject<RNTextInput>;
};

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (props, ref) => {
    const { fieldRef, focusNextInput, isLastField } = useFormField({
      ref,
      hasFocusCallback: true,
    });
    const [returnKeyType, setReturnKeyType] = React.useState(
      props.returnKeyType || 'next',
    );
    const {
      label,
      labelPosition = 'beforeInput',
      nextFormField,
      ...rest
    } = props;

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(
      () => generateAccessibilityLabelFromLabel(label, props),
      [label, props],
    );

    const clonedLabel = React.useMemo(() => {
      return React.Children.map(label, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-ignore
            importantForAccessibility: 'no',
            accessibilityElementsHidden: true,
          });
        }

        return child;
      });
    }, [label]);

    const handleOnSubmitEditing = (
      event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    ) => {
      rest?.onSubmitEditing?.(event);

      focusNextInput(nextFormField);
    };

    const checkReturnKeyType = (event: LayoutChangeEvent) => {
      if (isLastField()) {
        setReturnKeyType('done');
      }

      props.onLayout?.(event);
    };

    return (
      <>
        {showLabelBeforeInput ? clonedLabel : null}
        <RNTextInput
          // @ts-ignore
          ref={ref || fieldRef}
          key={returnKeyType}
          accessibilityLabel={accessibilityLabel}
          returnKeyType={returnKeyType}
          {...rest}
          onSubmitEditing={handleOnSubmitEditing}
          onLayout={checkReturnKeyType}
        />
        {showLabelBeforeInput ? null : clonedLabel}
      </>
    );
  },
);
