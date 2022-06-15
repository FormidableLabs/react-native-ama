import { contrastChecker } from './contrastChecker';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Contrast Checker', () => {
  it('does not perform any check if the backgroundColor is not defined', () => {
    const result = contrastChecker({
      style: [{ width: 100 }],
      children: [
        { props: { style: { color: 'fff' } } },
        {
          props: {
            style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
          },
        },
      ],
    });

    expect(result).toBe(null);
  });

  describe('Fail', () => {
    it('logs the Fail result when at least one child fails all the levels', () => {
      const result = contrastChecker({
        style: { backgroundColor: '#000' },
        children: [
          { props: { style: { color: 'fff' } } },
          {
            props: {
              style: { color: '#4a4a4a' },
            },
          },
        ],
      });

      expect(result).toMatchObject([
        {
          extra: { props: { style: { color: '#4a4a4a' } } },
          message:
            '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
          rule: 'CONTRAST_FAILED',
        },
      ]);
    });

    it('handles the styles passed as array', () => {
      const result = contrastChecker({
        style: { backgroundColor: '#000' },
        children: [
          { props: { style: { color: 'fff' } } },
          {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        ],
      });

      expect(result).toMatchObject({});
    });

    it('handles styles being an array', () => {
      contrastChecker(
        [{ backgroundColor: '#000' }],
        [
          { props: { style: { color: 'fff' } } },
          {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        ],
      );

      expect(log).toHaveBeenCalledWith(
        'CONTRAST_FAILED',
        '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
        {
          props: {
            style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
          },
        },
      );
    });

    it('handles nested children', () => {
      contrastChecker(
        [{ backgroundColor: '#000' }],
        [
          {
            props: {
              style: { color: 'fff' },
              children: [
                {
                  props: {
                    style: [
                      { textTransform: 'uppercase' },
                      { color: '#4a4a4a' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      );

      expect(log).toHaveBeenCalledWith(
        'CONTRAST_FAILED',
        '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
        {
          props: {
            style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
          },
        },
      );
    });

    it('handles nested children up to the specified level', () => {
      contrastChecker(
        [{ backgroundColor: '#000' }],
        [
          {
            props: {
              style: { color: 'fff' },
              children: [
                {
                  props: {
                    children: [
                      {
                        style: [
                          { textTransform: 'uppercase' },
                          { color: '#4a4a4a' },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      );
    });
  });

  describe('AA Large', () => {
    it('logs the "AA Large" fail result when at least one child fails the AA Normal text level', () => {
      const log = jest.spyOn(Logger, 'log');

      contrastChecker({ backgroundColor: '#000' }, [
        { props: { style: { color: '#6B6B6B' } } },
        {
          props: {
            style: { color: '#fff' },
          },
        },
      ]);

      expect(log).toHaveBeenCalledWith(
        'CONTRAST_FAILED',
        '"background: #000 with foreground: #6B6B6B: " fails AA Normal Text, but ✅ passes AA Large Text',
        { props: { style: { color: '#6B6B6B' } } },
      );
    });

    it('passes the check if font size is at least 14pt and bold', () => {
      const log = jest.spyOn(Logger, 'log');

      contrastChecker({ backgroundColor: '#000' }, [
        {
          props: {
            style: { color: '#6B6B6B', fontSize: 14, fontWeight: 'bold' },
          },
        },
        {
          props: {
            style: { color: '#fff' },
          },
        },
      ]);

      expect(log).not.toHaveBeenCalled();
    });

    it('passes the check if font size is at least 18pt', () => {
      const log = jest.spyOn(Logger, 'log');

      contrastChecker({ backgroundColor: '#000' }, [
        {
          props: {
            style: { color: '#6B6B6B', fontSize: 18 },
          },
        },
        {
          props: {
            style: { color: '#fff' },
          },
        },
      ]);

      expect(log).not.toHaveBeenCalled();
    });
  });

  it('logs the "AAA" fail result when at least one child fails the AAA text level', () => {
    const log = jest.spyOn(Logger, 'log');

    contrastChecker({ backgroundColor: '#000' }, [
      { props: { style: { color: '#757575' } } },
      {
        props: {
          style: { color: '#fff' },
        },
      },
    ]);

    expect(log).toHaveBeenCalledWith(
      'CONTRAST_FAILED_AAA',
      '"background: #000 with foreground: #757575: " fails the AAA Level',
      { props: { style: { color: '#757575' } } },
    );
  });
});

jest.mock('react', () => {
  return {
    Children: {
      forEach: (children = [], callback: Function) => {
        return children.forEach(child => {
          callback(child);
        });
      },
    },
  };
});
