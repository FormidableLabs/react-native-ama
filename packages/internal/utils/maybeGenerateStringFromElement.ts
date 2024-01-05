import * as React from 'react';

export const maybeGenerateStringFromElement = (
  element?: JSX.Element,
  alternativeString?: string | null,
) => {
  if (alternativeString || element == null) {
    return alternativeString || '';
  }

  const pieces = extractPieces(element);

  if (pieces == null || pieces?.length === 0) {
    console.error(
      `Cannot generate the string from ${element} prop. Please provide one!`,
    );
  }

  return pieces?.join(' ')?.replace(/\*$/, '');
};

const extractPieces = (component: JSX.Element | JSX.Element[]): any[] => {
  return React.Children.map(component, child => {
    if (!React.isValidElement(child)) {
      return '';
    }

    const children = (child.props as any).children;

    if (React.isValidElement(children) || Array.isArray(children)) {
      return extractPieces(children);
    }

    return children;
  });
};
