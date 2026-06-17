const ReactNativeAmaModule = {
  start: jest.fn(),
  stop: jest.fn(),
  highlight: jest.fn(),
  clearHighlight: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
};

export default ReactNativeAmaModule;
