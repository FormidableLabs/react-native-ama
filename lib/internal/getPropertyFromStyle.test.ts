import { getPropertyFromStyle } from './getPropertyFromStyle';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getPropertyFromStyle', () => {
  it('retrieves the given key from the style', () => {
    expect(
      getPropertyFromStyle(
        {
          backgroundColor: 'yellow',
        },
        'backgroundColor',
      ),
    ).toBe('yellow');
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
});
