import { getPropertyFromStyle } from './getPropertyFromStyle';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getPropertyFromStyle', () => {
  it('retrieves the given key from the style', () => {
    expect(
      getPropertyFromStyle(
        {
          alignItems: 'center',
          backgroundColor: '#000',
          flex: 1,
          justifyContent: 'center',
          marginTop: 12,
          minHeight: 48,
        },
        'backgroundColor',
      ),
    ).toBe('#000');
  });

  it('handles the style being an array', () => {
    expect(
      getPropertyFromStyle(
        [
          {
            backgroundColor: 'yellow',
          },
          {
            color: 'red',
          },
        ],
        'color',
      ),
    ).toBe('red');
  });

  it('retrieves the last value from an array', () => {
    expect(
      getPropertyFromStyle(
        [
          {
            backgroundColor: 'yellow',
          },
          {
            color: 'red',
          },
          {
            backgroundColor: 'cyan',
          },
        ],
        'backgroundColor',
      ),
    ).toBe('cyan');
  });

  it('handles undefined values', () => {
    expect(
      getPropertyFromStyle(
        [
          {
            backgroundColor: 'yellow',
            color: 'red',
            undefined,
          },
          undefined,
        ],
        'backgroundColor',
      ),
    ).toBe('yellow');
  });
});
