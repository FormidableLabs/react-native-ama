import React from 'react';
import type { StyleProp } from 'react-native';
import { score } from 'wcag-color';

import { getPropertyFromStyle } from '../getPropertyFromStyle';
import { LogParams, getContrastCheckerMaxDepth } from '../logger';

const MAX_DEPTH_LEVEL = getContrastCheckerMaxDepth();

export type ContrastCheckerParams = {
  style: StyleProp<any> | undefined | StyleProp<any>[];
  children: React.ReactNode;
};

export const contrastChecker = ({
  style,
  children,
}: ContrastCheckerParams): LogParams[] | null => {
  const backgroundColor = getPropertyFromStyle(style, 'backgroundColor');

  if (backgroundColor === undefined) {
    return null;
  }

  const failed = checkContrastInChildren(backgroundColor, children, 1);

  return failed.length > 0 ? failed : null;
};

const checkContrastInChildren = (
  backgroundColor: string,
  children: React.ReactNode,
  depthLevel: number,
): LogParams[] => {
  let contrastFailed: LogParams[] = [];

  React.Children.forEach(children as any, (child: JSX.Element | undefined) => {
    const childStyle = child?.props?.style || {};
    const color =
      getPropertyFromStyle(childStyle, 'color') || child?.props?.stroke;

    if (color) {
      const result = performContrastCheck(
        backgroundColor,
        color,
        child,
        childStyle,
      );

      if (result) {
        contrastFailed.push(result);
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
): LogParams | null => {
  const testFailed = `background: ${backgroundColor} with foreground: ${color}: `;
  const result = getContrastScore(backgroundColor, color);

  switch (result) {
    case 'Fail':
      return {
        rule: 'CONTRAST_FAILED',
        message: `"${testFailed}" fails all the contrast check`,
        extra: child,
      };
    case 'AA Large':
      if (
        isFontSizeLarge(childStyle.fontSize, childStyle.fontWeight === 'bold')
      ) {
        return null;
      }

      return {
        rule: 'CONTRAST_FAILED',
        message: `"${testFailed}" fails AA Normal Text, but ✅ passes AA Large Text`,
        extra: child,
      };
    case 'AA':
      return {
        rule: 'CONTRAST_FAILED',
        message: `"${testFailed}" fails the AAA Level`,
        extra: child,
      };
  }

  return null;
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
