import type { ReactNode } from 'react';

export function applyStyle(
  style: Record<string, any> | Function,
  devStyle: Record<any, any>,
  children?: ReactNode,
  contrastChecker?: Function,
) {
  if (typeof style === 'function') {
    return applyStyleFunction(style, devStyle, children, contrastChecker);
  }

  const contrastCheckerStyle = contrastChecker
    ? contrastChecker(style, children)
    : {};

  if (Array.isArray(style)) {
    style.push(devStyle);
    style.push(contrastCheckerStyle);

    return style.filter(item => Object.keys(item).length > 0);
  } else {
    return {
      ...style,
      ...devStyle,
      ...contrastCheckerStyle,
    };
  }
}

function applyStyleFunction(
  style: Function,
  devStyle: Record<any, any>,
  children?: ReactNode,
  contrastChecker?: Function,
) {
  return (...params: any) => {
    const s = style(...params);
    const contrastStyle = contrastChecker ? contrastChecker(s, children) : {};

    if (Array.isArray(s)) {
      s.push(devStyle);
      s.push(contrastStyle);

      return s;
    }

    return {
      ...s,
      ...devStyle,
      ...contrastStyle,
    };
  };
}
