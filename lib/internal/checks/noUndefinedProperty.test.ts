import { noUndefinedProperty } from './noUndefinedProperty';

afterEach(() => {
  jest.clearAllMocks();
});

describe('noUndefinedProperty', () => {
  it('returns null if the property is defined', () => {
    const result = noUndefinedProperty({
      properties: {
        test: 'yay is a here',
      },
      property: 'test',
      rule: 'RANDOM_RULE' as any,
    });

    expect(result).toBe(null);
  });

  it.each([null, undefined])(
    'returns the LogParam if the property is %s',
    value => {
      const result = noUndefinedProperty({
        properties: {
          test: value,
        },
        property: 'test',
        rule: 'RANDOM_RULE' as any,
      });

      expect(result).toMatchObject({
        message: 'The property "test" cannot be UNDEFINED',
        rule: 'RANDOM_RULE',
      });
    },
  );
});
