import { applyStyle } from '../internal/applyStyle';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('applyStyle', () => {
  it('handles the style being a function', () => {
    const style = jest.fn().mockReturnValue({ color: 'yellow' });

    const result = applyStyle?.({
      style,
      debugStyle: { backgroundColor: 'red' },
    });

    expect(result).toEqual(expect.any(Function));

    // @ts-ignore
    const theStyle = result('random params');

    expect(style).toHaveBeenCalledWith('random params');
    expect(theStyle).toEqual({ backgroundColor: 'red', color: 'yellow' });
  });

  it('handles the style function returning an array', () => {
    const style = jest.fn().mockReturnValue([{ color: 'yellow' }]);

    const result = applyStyle?.({
      style,
      debugStyle: { backgroundColor: 'red' },
    });

    expect(result).toEqual(expect.any(Function));

    // @ts-ignore
    const theStyle = result('random params');

    expect(style).toHaveBeenCalledWith('random params');
    expect(theStyle).toEqual([
      { color: 'yellow' },
      { backgroundColor: 'red' },
      {},
    ]);
  });
});
