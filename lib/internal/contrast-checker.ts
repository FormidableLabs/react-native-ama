import { score } from 'wcag-color';
import type { StyleProp } from 'react-native';
import React from 'react';
import { log } from './logger';

export const contrastChecker = (
  style: StyleProp<any> | undefined,
  children: React.ReactNode,
) => {
  const { backgroundColor } = style || {};

  React.Children.forEach(children as any, (child: JSX.Element | undefined) => {
    const childStyle = child?.props?.style || {};
    const { color } = childStyle;

    if (color == null) {
      return;
    }

    const result = getContrastScore(backgroundColor, color);

    switch (result) {
      case 'Fail':
        log('CONTRAST_CHECKER', 'Fails all the contrast check');
        break;
      case 'AA Large':
        if (
          isFontSizeLarge(childStyle.fontSize, childStyle.fontWeight === 'bold')
        ) {
          return;
        }

        log(
          'CONTRAST_CHECKER',
          'Fails AA Normal Text, but ✅ passes AA Large Text',
        );
        break;
      case 'AA':
        log('CONTRAST_CHECKER_AAA', 'Fails the AAA Level');
    }
  });
};

export const getContrastScore = (c1: string, c2: string) => {
  return score(c1, c2);
};

const isFontSizeLarge = (
  fontSize: number | undefined,
  isBold: boolean | undefined,
) => {
  return fontSize && (fontSize >= 18 || (fontSize >= 14 && isBold));
};
