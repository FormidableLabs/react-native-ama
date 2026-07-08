const noop = () => {};
const noopReturn = () => ({ remove: noop });

module.exports = {
  __esModule: true,
  default: {
    start: noop,
    stop: noop,
    highlight: noop,
    clearHighlight: noop,
    addListener: noopReturn,
  },
};
