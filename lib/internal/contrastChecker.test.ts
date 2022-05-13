import * as Logger from './logger';
import { contrastChecker } from './contrastChecker';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Contrast Checker', () => {
  it('it logs the Fail result when at least one child fails all the levels', () => {
    const log = jest.spyOn(Logger, 'log');

    contrastChecker({ backgroundColor: '#000' }, [
      { displayName: 'Component 2', props: { style: { color: 'fff' } } },
      {
        displayName: 'Component 1',
        props: {
          style: { color: '#4a4a4a' },
        },
      },
    ]);

    expect(log).toHaveBeenCalledWith(
      'CONTRAST_CHECKER',
      '"Component 1" fails all the contrast check',
    );
  });

  describe('AA Large', () => {
    it('it logs the "AA Large" fail result when at least one child fails the AA Normal text level', () => {
      const log = jest.spyOn(Logger, 'log');

      contrastChecker({ backgroundColor: '#000' }, [
        { displayName: 'Component 2', props: { style: { color: '#6B6B6B' } } },
        {
          displayName: 'Component 1',
          props: {
            style: { color: '#fff' },
          },
        },
      ]);

      expect(log).toHaveBeenCalledWith(
        'CONTRAST_CHECKER',
        '"Component 2" fails AA Normal Text, but ✅ passes AA Large Text',
      );
    });

    it('passes the check if font size is at least 14pt and bold', () => {
      const log = jest.spyOn(Logger, 'log');

      contrastChecker({ backgroundColor: '#000' }, [
        {
          displayName: 'Component 2',
          props: {
            style: { color: '#6B6B6B', fontSize: 14, fontWeight: 'bold' },
          },
        },
        {
          displayName: 'Component 1',
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
          displayName: 'Component 2',
          props: {
            style: { color: '#6B6B6B', fontSize: 18 },
          },
        },
        {
          displayName: 'Component 1',
          props: {
            style: { color: '#fff' },
          },
        },
      ]);

      expect(log).not.toHaveBeenCalled();
    });
  });

  it('it logs the "AAA" fail result when at least one child fails the AAA text level', () => {
    const log = jest.spyOn(Logger, 'log');

    contrastChecker({ backgroundColor: '#000' }, [
      { displayName: 'Component 2', props: { style: { color: '#757575' } } },
      {
        displayName: 'Component 1',
        props: {
          style: { color: '#fff' },
        },
      },
    ]);

    expect(log).toHaveBeenCalledWith(
      'CONTRAST_CHECKER_AAA',
      '"Component 2" fails the AAA Level',
    );
  });
});

jest.mock('./logger');
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
