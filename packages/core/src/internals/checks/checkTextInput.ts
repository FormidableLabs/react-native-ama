import { Platform } from 'react-native';
import { AmaNode } from '../../ReactNativeAma.types';
import { AmaError } from '../types';
import { isRuleDisabled } from '../utils/isRuleDisabled';

const RETURN_DONE = Platform.select({ ios: 0, default: 6 });

const REMOVE_ENDING_REGEXT = /\W$/;

const removeEndingSymbol = (text?: string) => {
    if (!text) {
        return null;
    }

    const result = text.replace(REMOVE_ENDING_REGEXT, '').trim().toLowerCase();

    return result;
};

export const checkTextInputs = (nodesToCheck: AmaNode[]): AmaError[] => {
    const inputs = nodesToCheck.filter((node) => node.type === 'TextInput');
    const errors: AmaError[] = [];

    for (const key in inputs) {
        const index = parseInt(key, 10);
        const inputText = inputs[key];
        const canHaveReturnTypeDone = index === inputs.length - 1;
        const ariaLabel = removeEndingSymbol(inputText.ariaLabel);
        const textInputLabel = ariaLabel
            ? nodesToCheck.find(
                // Ignores symbols like ":"
                (node) => node.type === 'Text' && removeEndingSymbol(node.content) === ariaLabel
            )
            : false;

        const isLabelAlsoAccessible =
            textInputLabel && textInputLabel?.isAccessible;
        const hasLabel = Boolean(textInputLabel);

        if (inputText.returnType === RETURN_DONE && !canHaveReturnTypeDone) {
            errors.push({
                rule: 'INPUT_INVALID_RETURN_KEY',
                viewId: inputText.viewId,
            });
        }

        if (isLabelAlsoAccessible) {
            errors.push({
                rule: 'INPUT_HAS_FOCUSABLE_LABEL',
                viewId: textInputLabel.viewId,
            });
        }

        if (ariaLabel && !hasLabel) {
            errors.push({
                rule: 'INPUT_HAS_NO_VISIBLE_LABEL',
                viewId: inputText.viewId,
            });
        }
    }

    return errors.filter(
        (item): item is AmaError => !isRuleDisabled?.(item)
    );
};
