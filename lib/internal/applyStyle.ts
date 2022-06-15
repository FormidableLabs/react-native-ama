import type { ReactNode } from 'react';

export function applyStyle({
  style,
  debugStyle,
  children,
  contrastCheckerCallback,
}: {
  style: Record<string, any> | Function;
  debugStyle: Record<any, any>;
  children?: ReactNode;
  contrastCheckerCallback?: Function;
}) {
  if (typeof style === 'function') {
    return applyStyleFunction(
      style,
      debugStyle,
      children,
      contrastCheckerCallback,
    );
  }

  const contrastCheckerStyle = contrastCheckerCallback
    ? contrastCheckerCallback(style, children)
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

function applyStyleFunction(
  style: Function,
  debugStyle: Record<any, any>,
  children?: ReactNode,
  contrastCheckerCallback?: Function,
) {
  return (...params: any) => {
    const s = style(...params);
    const contrastStyle = contrastCheckerCallback
      ? contrastCheckerCallback(s, children)
      : {};

    if (Array.isArray(s)) {
      s.push(debugStyle);
      s.push(contrastStyle);

      return s;
    }

    return {
      ...s,
      ...debugStyle,
      ...contrastStyle,
    };
  };
}
