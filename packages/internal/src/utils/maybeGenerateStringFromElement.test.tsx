import React from 'react';
import { Text } from 'react-native';

import { maybeGenerateStringFromElement } from '../internal/maybeGenerateStringFromElement';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('maybeGenerateStringFromElement', () => {
  it('returns the alternative string if provided', () => {
    // @ts-ignore
    expect(maybeGenerateStringFromElement('', 'this is it')).toBe('this is it');
  });

  it('extract the string from the direct children', () => {
    expect(maybeGenerateStringFromElement(<Text>This is the label</Text>)).toBe(
      'This is the label',
    );
  });

  it('extract the accessibilityLabel from nested children', () => {
    expect(
      maybeGenerateStringFromElement(
        <>
          <Text>This label</Text>
          <Text>is split</Text>
          <>
            <Text>in 3 parts</Text>
          </>
        </>,
      ),
    ).toBe('This label is split in 3 parts');
  });

  it("console.error the error if can't extract any string from the component", () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    const result = maybeGenerateStringFromElement(<></>);

    expect(result).toBe('');
    expect(spy).toHaveBeenCalledWith(
      'Cannot generate the string from [object Object] prop. Please provide one!',
    );
  });
});
