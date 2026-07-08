beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('amaClearHighlight', () => {
  it('calls ReactNativeAmaModule.clearHighlight with the viewId', () => {
    const clearHighlight = jest.fn();
    jest.doMock('../../ReactNativeAmaModule', () => ({
      __esModule: true,
      default: { clearHighlight },
    }));

    const { amaClearHighlight } = require('./amaClearHighlight');
    amaClearHighlight({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 42 });

    expect(clearHighlight).toHaveBeenCalledWith(42);
  });
});
