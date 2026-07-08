const useAMAContext = jest.fn(() => ({
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
  isReduceTransparencyEnabled: false,
  isGrayscaleEnabled: false,
  isBoldTextEnabled: false,
  isInvertColorsEnabled: false,
}));

const AMAProvider = ({ children }) => children;
const AutofocusContainer = ({ children }) => children;
const useAMAContextDev = jest.fn(() => ({}));
const useFocus = jest.fn(() => ({ setFocus: jest.fn() }));
const useChecks = jest.fn(() => ({}));
const useTimedAction = jest.fn(() => ({}));

module.exports = {
  __esModule: true,
  useAMAContext,
  AMAProvider,
  AutofocusContainer,
  useFocus,
  useChecks,
  useTimedAction,
  default: {
    start: jest.fn(),
    stop: jest.fn(),
    highlight: jest.fn(),
    clearHighlight: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
};
