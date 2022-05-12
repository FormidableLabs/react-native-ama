import { contrastChecker } from './contrast-checker';
import React from 'react';

beforeEach(() => {
  jest.resetAllMocks();

  React.Children = {
    forEach: (children = [], callback: Function) => {
      return children.forEach(child => callback(child));
    },
  };
  // jest.spyOn(React, 'Children').mockImplementation(children => children);
});

describe('Contrast Checker', () => {
  it('it prints and throws an error if at least one child fails all the levels', () => {
    const error = jest.spyOn(console, 'error');

    expect(() => {
      contrastChecker({ backgroundColor: '#000' }, [
        { displayName: 'Component 1', color: '#8f8f8f' },
        { displayName: 'Component 2', color: 'fff' },
      ]);
    }).toThrow();

    expect(error).toHaveBeenCalledWith('ciao');
  });
});
