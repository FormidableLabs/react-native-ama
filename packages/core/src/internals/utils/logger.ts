const _log = __DEV__
  ? (consoleMethod: Function, msg: string) => {
      consoleMethod(`[React Native AMA]: ${msg}`);
    }
  : null;

const logger = _log
  ? {
      log: (msg: string) => _log(console.debug, msg),
      warn: (msg: string) => _log(console.warn, msg),
      error: (msg: string) => _log(console.error, msg),
    }
  : null;

export default logger;
