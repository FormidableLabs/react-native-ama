import { AmaNode } from '../../ReactNativeAma.types';
import { AmaError } from '../types';

export const checkImageAlt = (node: AmaNode): AmaError | null => {
    if (node.type !== 'Image') {
        return null;
    }

    if (node.isAccessible === false) {
        return null;
    }

    const { ariaLabel } = node;

    if (!ariaLabel?.trim()) {
        return {
            rule: 'IMAGE_MISSING_ALT_TEXT',
            viewId: node.viewId,
        };
    }

    return null;
};
