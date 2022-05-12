import { useAMAContext } from '../components/AMAProvider';

export const useTimeout = () => {
  const { isScreenReaderEnabled } = useAMAContext();

  const onTimeout = (handler: any, timeout?: any, ...args: any[]) => {
    return isScreenReaderEnabled ? noop() : setTimeout(handler, timeout, args);
  };

  return {
    onTimeout,
  };
};

const noop = () => {};
