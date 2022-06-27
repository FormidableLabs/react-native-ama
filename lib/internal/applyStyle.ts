import type { ReactNode } from 'react';

import type { ContrastChecker } from '../internal/checks/contrastChecker';

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
          try {
            s.push(debugStyle);
            s.push(contrastStyle);
          } catch {}

          return s;
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
      style: Record<string, any> | Function;
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
        style.push(debugStyle);
        style.push(contrastCheckerStyle);

        return style.filter(item => Object.keys(item).length > 0);
      } else {
        return {
          ...style,
          ...debugStyle,
          ...contrastCheckerStyle,
        };
      }
    }
  : null;
