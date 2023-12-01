import type { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

import type { ContrastChecker } from '../checks/contrastChecker';

const applyStyleFunction = __DEV__
  ? (
      style: Function,
      debugStyle: Record<any, any>,
      children?: ReactNode,
      contrastCheckerCallback?:
        | ((_: ContrastChecker) => Record<string, any>)
        | undefined,
    ) => {
      return (...params: any) => {
        const s = style(...params);
        const contrastStyle = contrastCheckerCallback
          ? contrastCheckerCallback({ style: s, children })
          : {};

        if (Array.isArray(s)) {
          return [...s, debugStyle, contrastStyle];
        }

        return {
          ...s,
          ...debugStyle,
          ...contrastStyle,
        };
      };
    }
  : null;

export const applyStyle = __DEV__
  ? ({
      style,
      debugStyle,
      children,
      contrastCheckerCallback,
    }: {
      style: ViewStyle | Function | any;
      debugStyle: Record<any, any>;
      children?: ReactNode;
      contrastCheckerCallback?:
        | ((_: ContrastChecker) => Record<string, any>)
        | undefined;
    }) => {
      if (typeof style === 'function') {
        return applyStyleFunction?.(
          style,
          debugStyle,
          children,
          contrastCheckerCallback,
        );
      }

      const contrastCheckerStyle = contrastCheckerCallback
        ? contrastCheckerCallback({ style, children })
        : {};

      if (Array.isArray(style)) {
        return [...style, debugStyle, contrastCheckerStyle].filter(Boolean);
      } else {
        return {
          ...style,
          ...debugStyle,
          ...contrastCheckerStyle,
        };
      }
    }
  : null;
