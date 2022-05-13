import React from 'react';
import type { StyleProp } from 'react-native';
import { score } from 'wcag-color';

import { log } from './logger';

export const contrastChecker = (
  style: StyleProp<any> | undefined,
  children: React.ReactNode,
) => {
  const backgroundColor = getPropertyFromStyle(style, 'backgroundColor');

  if (backgroundColor === undefined) {
    return;
  }

  React.Children.forEach(children as any, (child: JSX.Element | undefined) => {
    const childStyle = child?.props?.style || {};
    const color = getPropertyFromStyle(childStyle, 'color');

    if (color == null) {
      return;
    }

    const testFailed = `background: ${backgroundColor} with foreground: ${color}: `;
    const result = getContrastScore(backgroundColor, color);

    switch (result) {
      case 'Fail':
        log('CONTRAST_FAILED', `"${testFailed}" fails all the contrast check`);
        break;
      case 'AA Large':
        if (
          isFontSizeLarge(childStyle.fontSize, childStyle.fontWeight === 'bold')
        ) {
          return;
        }

        log(
          'CONTRAST_FAILED',
          `"${testFailed}" fails AA Normal Text, but ✅ passes AA Large Text`,
        );
        break;
      case 'AA':
        log('CONTRAST_FAILED_AAA', `"${testFailed}" fails the AAA Level`);
    }
  });
};

const getPropertyFromStyle = (
  style: StyleProp<any> | StyleProp<any>[] | null,
  key: keyof StyleProp<any>,
) => {
  return Array.isArray(style)
    ? style.find(theStyle => theStyle[key])?.[key]
    : style?.[key];
};

const getContrastScore = (c1: string, c2: string) => {
  return score(c1, c2);
};

const isFontSizeLarge = (
  fontSize: number | undefined,
  isBold: boolean | undefined,
) => {
  return fontSize && (fontSize >= 18 || (fontSize >= 14 && isBold));
};
