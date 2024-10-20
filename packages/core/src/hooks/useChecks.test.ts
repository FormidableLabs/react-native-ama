import { type RuleAction } from '@react-native-ama/internal';
import * as RNAInternal from '@react-native-ama/internal';
import { renderHook } from '@testing-library/react-native';

import * as AMAProvider from '../components/AMAProvider';
import { useChecks } from './useChecks';

const trackError = jest.fn();
const removeError = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'warn').mockImplementation();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();

  jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
    trackError,
    removeError,
  } as any);
});

describe('useChecks', () => {
  it.each(['MUST_NOT', 'MUST'])(
    'tracks the error only if the rule is %s',
    ruleValue => {
      jest
        // @ts-ignore
        .spyOn(RNAInternal, 'getRuleAction')
        // @ts-ignore
        .mockReturnValue(ruleValue as RuleAction);

      const { result } = renderHook(() => useChecks());

      result.current?.logResult('test-me', {
        rule: 'NO_UNDEFINED',
        extra: 'extra',
        message: 'message',
      });

      expect(trackError).toHaveBeenCalledTimes(1);
      expect(trackError).toHaveBeenCalledWith(expect.any(String));
    },
  );

  it.each(['SHOULD', 'SHOULD_NOT'])(
    'does not track the error if the rule is %s',
    ruleValue => {
      const spy = jest.spyOn(console, 'warn');

      jest
        // @ts-ignore
        .spyOn(RNAInternal, 'getRuleAction')
        // @ts-ignore
        .mockReturnValue(ruleValue as RuleAction);

      const { result } = renderHook(() => useChecks());

      result.current?.logResult('test-me', {
        rule: 'NO_UNDEFINED',
        extra: 'extra',
        message: 'message',
      });

      expect(trackError).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalled();
    },
  );

  it.each(['MUST_NOT', 'MUST'])(
    'tracks the same error only once',
    ruleValue => {
      jest
        // @ts-ignore
        .spyOn(RNAInternal, 'getRuleAction')
        // @ts-ignore
        .mockReturnValue(ruleValue as RuleAction);

      const { result } = renderHook(() => useChecks());

      result.current?.logResult('test-me', {
        rule: 'NO_UNDEFINED',
        extra: 'extra',
        message: 'message',
      });

      expect(trackError).toHaveBeenCalledTimes(1);

      trackError.mockClear();

      result.current?.logResult('test-me', {
        rule: 'NO_UNDEFINED',
        extra: 'extra',
        message: 'message',
      });

      expect(trackError).toHaveBeenCalledTimes(0);
    },
  );

  it('removes the tracked error after has been fixed', () => {
    // @ts-ignore
    jest.spyOn(RNAInternal, 'getRuleAction').mockReturnValue('MUST');

    const { result } = renderHook(() => useChecks());

    result.current?.logResult('test-me', {
      rule: 'NO_UNDEFINED',
      extra: 'extra',
      message: 'message',
    });

    expect(trackError).toHaveBeenCalledWith(expect.any(String));

    result.current?.logResult('test-me', null);

    expect(removeError).toHaveBeenCalledWith(trackError.mock.calls[0][0]);
  });

  it('checks for compatible accessibility state', () => {
    const check = jest
      .spyOn(RNAInternal, 'checkForAccessibilityState')
      .mockReturnValue(null);
    const { result } = renderHook(() => useChecks());

    result.current?.checkCompatibleAccessibilityState({
      hello: 'world',
      busy: true,
      checked: 'wow',
      accessibilityRole: 'button',
    });

    expect(check).toHaveBeenCalledWith({
      accessibilityRole: 'button',
      accessibilityState: undefined,
      checked: 'wow',
    });
  });

  it('checks for compatible accessibility state when accessibilityState is passed', () => {
    const check = jest
      .spyOn(RNAInternal, 'checkForAccessibilityState')
      .mockReturnValue(null);
    const { result } = renderHook(() => useChecks());

    result.current?.checkCompatibleAccessibilityState({
      hello: 'world',
      checked: false,
      accessibilityState: {
        selected: 'yeah',
      },
      accessibilityRole: 'button',
    });

    expect(check).toHaveBeenCalledWith({
      accessibilityRole: 'button',
      accessibilityState: {
        selected: 'yeah',
      },
      checked: false,
    });
  });

  it('checks for compatible accessibility role', () => {
    const check = jest
      .spyOn(RNAInternal, 'checkAccessibilityRole')
      .mockReturnValue(null);
    const { result } = renderHook(() => useChecks());

    result.current?.checkAccessibilityRole('button');

    expect(check).toHaveBeenCalledWith('button');
  });
});

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');

  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      // Redefine an export, like a component
      Button: 'Button',
      // Mock out properties of an already mocked export
      LayoutAnimation: {
        ...ReactNative.LayoutAnimation,
        configureNext: jest.fn(),
      },
      Platform: {
        ...ReactNative.Platform,
        OS: 'ios',
        Version: 123,
        isTesting: true,
        select: (objs: { ios: any }) => objs.ios,
      },
      // Mock a native module
      NativeModules: {
        ...ReactNative.NativeModules,
        Override: { great: 'success' },
      },
      InteractionManager: {
        // @ts-ignore
        runAfterInteractions: callback => {
          callback();
        },
      },
    },
    ReactNative,
  );
});
