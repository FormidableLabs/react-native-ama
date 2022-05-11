import { amaNoUndefined } from './debug';

beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Internal Debug utilities', () => {
  it('amaNoUndefined: prints and throws an Error if the given property is undefined', () => {
    jest.spyOn(console, 'error');

    expect(() =>
      amaNoUndefined({} as any, 'test'),
    ).toThrowErrorMatchingInlineSnapshot(
      '"AMA: The property \\"test\\" cannot be UNDEFINED"',
    );
    expect(console.error).toHaveBeenCalledWith(
      'AMA: Please specify the "test" property',
    );
  });
});
