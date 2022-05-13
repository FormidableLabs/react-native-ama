import React from 'react';
import type { StyleProp } from 'react-native';
import { score } from 'wcag-color';

import { log } from './logger';

export const contrastChecker = (
  style: StyleProp<any> | undefined,
  children: React.ReactNode,
) => {
  const { backgroundColor } = style || {};

  React.Children.forEach(children as any, (child: JSX.Element | undefined) => {
    const childStyle = child?.props?.style || {};
    const { color } = childStyle;

    // TODO: Fix style
    // @ts-ignore
    const displayName = child?.displayName;

    if (color == null) {
      return;
    }

    const result = getContrastScore(backgroundColor, color);

    switch (result) {
      case 'Fail':
        log(
          'CONTRAST_CHECKER',
          `"${displayName}" fails all the contrast check`,
        );
        break;
      case 'AA Large':
        if (
          isFontSizeLarge(childStyle.fontSize, childStyle.fontWeight === 'bold')
        ) {
          return;
        }

        log(
          'CONTRAST_CHECKER',
          `"${displayName}" fails AA Normal Text, but ✅ passes AA Large Text`,
        );
        break;
      case 'AA':
        log('CONTRAST_CHECKER_AAA', `"${displayName}" fails the AAA Level`);
    }
  });
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
