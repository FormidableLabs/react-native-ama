import { numerify } from './numerify';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('numerify', () => {
  it('adds a space between each digit', () => {
    expect(numerify('123')).toEqual('1 2 3');
  });
});
