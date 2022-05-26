import * as React from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData,
} from 'react-native';

import { checkFocusTrap } from '../internal/checkFocusTrap';
import { noUndefined } from '../internal/noUndefined';

export type TextInputProps = Omit<RNTextInputProps, 'returnKeyType'> & {
  label: JSX.Element;
  labelPosition?: 'beforeInput' | 'afterInput';
} & (
    | {
        returnKeyType: Exclude<ReturnKeyTypeOptions, 'next'>;
      }
    | {
        returnKeyType: 'next';
        nextTextInput: React.RefObject<RNTextInput>;
      }
  );

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (props, ref) => {
    const { label, labelPosition = 'beforeInput', ...rest } = props;

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(() => {
      __DEV__ && noUndefined(props, 'label');

      if (props.accessibilityLabel) {
        return '';
      }

      return React.Children.map(label, child => {
        return child.props.children;
      })
        ?.join(',')
        ?.replace(/\*$/, '');
    }, [label, props]);

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

      if (rest.returnKeyType === 'next') {
        // @ts-ignore
        __DEV__ && noUndefined(props, 'nextTextInput');

        rest.nextTextInput.current?.focus();

        __DEV__ && checkFocusTrap(rest.nextTextInput);
      }
    };

    return (
      <>
        {showLabelBeforeInput ? clonedLabel : null}
        <RNTextInput
          ref={ref}
          accessibilityLabel={accessibilityLabel}
          {...rest}
          onSubmitEditing={handleOnSubmitEditing}
        />
        {showLabelBeforeInput ? null : clonedLabel}
      </>
    );
  },
);
