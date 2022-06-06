import React from 'react';
import { Text } from 'react-native';

import { generateAccessibilityLabelFromProps } from './generateAccessibilityLabelFromProps';
import * as AMANoUndefined from './noUndefinedProperty';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('generateAccessibilityLabelFromProps', () => {
  it('checks that the label is defined', () => {
    const noUndefined = jest.spyOn(AMANoUndefined, 'noUndefinedProperty');

    try {
      generateAccessibilityLabelFromProps({});
    } catch {}

    expect(noUndefined).toHaveBeenCalledWith({}, 'label');
  });

  it('returns the accessibilityLabel if provided', () => {
    expect(
      generateAccessibilityLabelFromProps({ accessibilityLabel: 'this is it' }),
    ).toBe('this is it');
  });

  it('extract the accessibilityLabel from direct children', () => {
    expect(
      generateAccessibilityLabelFromProps({
        label: <Text>This is the label</Text>,
      }),
    ).toBe('This is the label');
  });

  it('extract the accessibilityLabel from nested children', () => {
    expect(
      generateAccessibilityLabelFromProps({
        label: (
          <>
            <Text>This label</Text>
            <Text>is split</Text>
            <>
              <Text>in 3 parts</Text>
            </>
          </>
        ),
      }),
    ).toBe('This label is split in 3 parts');
  });
});

jest.mock('../internal/noUndefinedProperty');
