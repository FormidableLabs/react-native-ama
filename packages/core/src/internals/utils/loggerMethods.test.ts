beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('logger', () => {
  it('logger.log calls console.debug with the AMA prefix', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    const logger = require('./logger').default;

    logger.log('hello');

    expect(spy).toHaveBeenCalledWith('[React Native AMA]: hello');
    spy.mockRestore();
  });

  it('logger.warn calls console.warn with the AMA prefix', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    const logger = require('./logger').default;

    logger.warn('something wrong');

    expect(spy).toHaveBeenCalledWith('[React Native AMA]: something wrong');
    spy.mockRestore();
  });

  it('logger.error calls console.error with the AMA prefix', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    const logger = require('./logger').default;

    logger.error('critical error');

    expect(spy).toHaveBeenCalledWith('[React Native AMA]: critical error');
    spy.mockRestore();
  });
});
