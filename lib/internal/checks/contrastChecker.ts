import React from 'react';
import type { StyleProp } from 'react-native';
import { score } from 'wcag-color';

import { getPropertyFromStyle } from '../getPropertyFromStyle';
import { getContrastCheckerMaxDepth, log } from '../logger';
import type { CHECK_STATUS } from './types';

const MAX_DEPTH_LEVEL = getContrastCheckerMaxDepth();

export const contrastChecker = (
  style: StyleProp<any> | undefined | StyleProp<any>[],
  children: React.ReactNode,
): CHECK_STATUS => {
  const backgroundColor = getPropertyFromStyle(style, 'backgroundColor');

  if (backgroundColor === undefined) {
    return 'SUCCEED';
  }

  const hasFailed = checkContrastInChildren(backgroundColor, children, 1);

  return hasFailed ? 'ERROR' : 'SUCCEED';
};

const checkContrastInChildren = (
  backgroundColor: string,
  children: React.ReactNode,
  depthLevel: number,
) => {
  let contrastFailed = false;

  React.Children.forEach(children as any, (child: JSX.Element | undefined) => {
    const childStyle = child?.props?.style || {};
    const color =
      getPropertyFromStyle(childStyle, 'color') || child?.props?.stroke;

    if (color) {
      const hasFailed = performContrastCheck(
        backgroundColor,
        color,
        child,
        childStyle,
      );

      if (hasFailed) {
        contrastFailed = hasFailed;
      }
    }

    if (depthLevel < MAX_DEPTH_LEVEL && child?.props?.children) {
      checkContrastInChildren(
        backgroundColor,
        child.props.children,
        depthLevel + 1,
      );
    }
  });

  return contrastFailed;
};

const performContrastCheck = (
  backgroundColor: string,
  color: string,
  child: JSX.Element | undefined,
  childStyle: Record<string, any>,
) => {
  const testFailed = `background: ${backgroundColor} with foreground: ${color}: `;
  const result = getContrastScore(backgroundColor, color);

  switch (result) {
    case 'Fail':
      log(
        'CONTRAST_FAILED',
        `"${testFailed}" fails all the contrast check`,
        child,
      );

      return true;
    case 'AA Large':
      if (
        isFontSizeLarge(childStyle.fontSize, childStyle.fontWeight === 'bold')
      ) {
        return false;
      }

      log(
        'CONTRAST_FAILED',
        `"${testFailed}" fails AA Normal Text, but ✅ passes AA Large Text`,
        child,
      );

      return true;
    case 'AA':
      log('CONTRAST_FAILED_AAA', `"${testFailed}" fails the AAA Level`, child);
  }

  return false;
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
