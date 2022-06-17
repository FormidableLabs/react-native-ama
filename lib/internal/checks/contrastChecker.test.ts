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
      const result = contrastChecker({
        style: [{ backgroundColor: '#000' }],
        children: [
          { props: { style: { color: 'fff' } } },
          {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        ],
      });

      expect(result).toMatchObject([
        {
          rule: 'CONTRAST_FAILED',
          message:
            '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
          extra: {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        },
      ]);
    });

    it('handles nested children', () => {
      const result = contrastChecker({
        style: [{ backgroundColor: '#000' }],
        children: [
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
      });

      expect(result).toMatchObject([
        {
          rule: 'CONTRAST_FAILED',
          message:
            '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
          extra: {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        },
      ]);
    });

    it('returns all the failing children', () => {
      const result = contrastChecker({
        style: [{ backgroundColor: '#000' }],
        children: [
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
          {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
          { props: { style: { color: '#757575' } } },
        ],
      });

      expect(result).toMatchObject([
        {
          rule: 'CONTRAST_FAILED',
          message:
            '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
          extra: {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        },
        {
          rule: 'CONTRAST_FAILED',
          message:
            '"background: #000 with foreground: #4a4a4a: " fails all the contrast check',
          extra: {
            props: {
              style: [{ textTransform: 'uppercase' }, { color: '#4a4a4a' }],
            },
          },
        },
        {
          rule: 'CONTRAST_FAILED_AAA',
          message:
            '"background: #000 with foreground: #757575: " fails the AAA Level',
          extra: { props: { style: { color: '#757575' } } },
        },
      ]);
    });

    it('handles nested children up to the specified level', () => {
      contrastChecker({
        style: [{ backgroundColor: '#000' }],
        children: [
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
      });
    });
  });

  describe('AA Large', () => {
    it('fails when one or more child fails the AA Normal text level', () => {
      const result = contrastChecker({
        style: { backgroundColor: '#000' },
        children: [
          { props: { style: { color: '#6B6B6B' } } },
          {
            props: {
              style: { color: '#fff' },
            },
          },
        ],
      });

      expect(result).toMatchObject([
        {
          rule: 'CONTRAST_FAILED',
          message:
            '"background: #000 with foreground: #6B6B6B: " fails AA Normal Text, but ✅ passes AA Large Text',
          extra: { props: { style: { color: '#6B6B6B' } } },
        },
      ]);
    });

    it('passes the check if font size is at least 14pt and bold', () => {
      const result = contrastChecker({
        style: { backgroundColor: '#000' },
        children: [
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
        ],
      });

      expect(result).toBe(null);
    });

    it('passes the check if font size is at least 18pt', () => {
      const result = contrastChecker({
        style: { backgroundColor: '#000' },
        children: [
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
        ],
      });

      expect(result).toBe(null);
    });
  });

  it('fails when one or more child fails the AAA text level', () => {
    const result = contrastChecker({
      style: { backgroundColor: '#000' },
      children: [
        { props: { style: { color: '#757575' } } },
        {
          props: {
            style: { color: '#fff' },
          },
        },
      ],
    });

    expect(result).toMatchObject([
      {
        rule: 'CONTRAST_FAILED_AAA',
        message:
          '"background: #000 with foreground: #757575: " fails the AAA Level',
        extra: { props: { style: { color: '#757575' } } },
      },
    ]);
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
