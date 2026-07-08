import { renderHook, act } from '@testing-library/react-native';
import projectRules from './config';

let mockStart: jest.Mock;
let mockStop: jest.Mock;
let mockHighlight: jest.Mock;
let mockClearHighlight: jest.Mock;
let mockAddListener: jest.Mock;
let onAmaNodesCallback: ((data: any) => void) | null = null;
let onUIInteractionCallback: ((data: any) => void) | null = null;

jest.mock('../ReactNativeAmaModule', () => {
  mockStart = jest.fn();
  mockStop = jest.fn();
  mockHighlight = jest.fn().mockResolvedValue([0, 0, 100, 50]);
  mockClearHighlight = jest.fn();
  mockAddListener = jest.fn().mockImplementation((event: string, cb: any) => {
    if (event === 'onAmaNodes') {
      onAmaNodesCallback = cb;
    } else if (event === 'onUIInteraction') {
      onUIInteractionCallback = cb;
    }
    return { remove: jest.fn() };
  });

  return {
    __esModule: true,
    default: {
      start: (...args: any[]) => mockStart(...args),
      stop: (...args: any[]) => mockStop(...args),
      highlight: (...args: any[]) => mockHighlight(...args),
      clearHighlight: (...args: any[]) => mockClearHighlight(...args),
      addListener: (...args: any[]) => mockAddListener(...args),
    },
  };
});

jest.mock('./utils/logFoundIssues', () => ({
  logFoundIssues: jest.fn(),
}));

jest.mock('./utils/amaClearHighlight', () => ({
  amaClearHighlight: jest.fn(),
}));

const makeNode = (overrides = {}) => ({
  type: 'Text',
  viewId: 1,
  traits: ['header'],
  ariaRole: 'header',
  ariaLabel: 'Title',
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  onAmaNodesCallback = null;
  onUIInteractionCallback = null;
  // @ts-ignore
  global.__DEV__ = true;
});

afterEach(() => {
  projectRules.rules = {} as typeof projectRules.rules;
});

describe('useAMADev', () => {
  it('starts AMA monitoring on mount', () => {
    const { useAMADev } = require('./useAMADev');
    renderHook(() => useAMADev!());
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  it('registers onAmaNodes and onUIInteraction listeners', () => {
    const { useAMADev } = require('./useAMADev');
    renderHook(() => useAMADev!());
    expect(mockAddListener).toHaveBeenCalledWith('onAmaNodes', expect.any(Function));
    expect(mockAddListener).toHaveBeenCalledWith('onUIInteraction', expect.any(Function));
  });

  it('stops AMA monitoring on unmount', () => {
    const { useAMADev } = require('./useAMADev');
    const { unmount } = renderHook(() => useAMADev!());
    unmount();
    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it('returns empty issues initially', () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());
    expect(result.current.issues).toEqual([]);
  });

  it('adds NO_HEADER_FOUND issue when no header node is present', async () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());

    await act(async () => {
      onAmaNodesCallback?.({ 1: makeNode({ type: 'View', traits: [], ariaRole: 'button' }) });
    });

    expect(result.current.issues).toContainEqual(
      expect.objectContaining({ rule: 'NO_HEADER_FOUND' }),
    );
  });

  it('does not add NO_HEADER_FOUND when a header node is present', async () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());

    await act(async () => {
      onAmaNodesCallback?.({ 1: makeNode({ type: 'Text', ariaRole: 'header' }) });
    });

    const headerIssues = result.current.issues.filter(
      (i: any) => i.rule === 'NO_HEADER_FOUND',
    );
    expect(headerIssues).toHaveLength(0);
  });

  it('highlights a component when a Pressable has no accessibility label', async () => {
    const { useAMADev } = require('./useAMADev');
    renderHook(() => useAMADev!());

    await act(async () => {
      onAmaNodesCallback?.({
        1: makeNode({ type: 'Text', ariaRole: 'header', viewId: 1 }),
        42: {
          type: 'Pressable',
          viewId: 42,
          traits: ['button'],
          ariaRole: 'button',
          ariaLabel: undefined,
          width: 50,
          height: 50,
        },
      });
    });

    expect(mockHighlight).toHaveBeenCalledWith(42, expect.any(String), expect.any(String), expect.any(Number));
  });

  it('handles checkResultUiInteraction with no data gracefully', async () => {
    const { useAMADev } = require('./useAMADev');
    renderHook(() => useAMADev!());

    await act(async () => {
      onUIInteractionCallback?.(undefined);
    });

    expect(mockHighlight).not.toHaveBeenCalled();
  });

  it('clears highlights for fixed issues when new check has fewer problems', async () => {
    const { amaClearHighlight } = require('./utils/amaClearHighlight');
    const { useAMADev } = require('./useAMADev');
    renderHook(() => useAMADev!());

    const badPressable = {
      type: 'Pressable',
      viewId: 99,
      traits: ['button'],
      ariaRole: 'button',
      ariaLabel: undefined,
      width: 50,
      height: 50,
    };

    await act(async () => {
      onAmaNodesCallback?.({
        1: makeNode({ type: 'Text', ariaRole: 'header', viewId: 1 }),
        99: badPressable,
      });
    });

    expect(mockHighlight).toHaveBeenCalled();

    await act(async () => {
      onAmaNodesCallback?.({
        1: makeNode({ type: 'Text', ariaRole: 'header', viewId: 1 }),
        99: { ...badPressable, ariaLabel: 'Fixed label' },
      });
    });

    expect(amaClearHighlight).toHaveBeenCalled();
  });

  it('checkResultUiInteraction flags NO_ACCESSIBILITY_STATE_SET when state did not change after tap', async () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());

    await act(async () => {
      onAmaNodesCallback?.({
        1: makeNode({ type: 'Text', ariaRole: 'header', viewId: 1 }),
        100: makeNode({ type: 'Pressable', viewId: 100, ariaRole: 'button', ariaLabel: 'Toggle', traits: ['button'] }),
      });
    });

    const snapshot = { label: 'Toggle', role: 'button', isChecked: false, isBusy: false, isSelected: false, isDisabled: false, isExpanded: false, parentId: 0 };

    await act(async () => {
      onUIInteractionCallback?.({
        rootTag: 100,
        beforeModalVisible: false,
        afterModalVisible: false,
        before: { 100: { ...snapshot, label: 'Toggle changed' } },
        after: { 100: snapshot },
        afterSettled: { 100: snapshot },
      });
    });

    expect(result.current.issues.some((i: any) => i.rule === 'NO_ACCESSIBILITY_STATE_SET')).toBe(true);
  });

  it('checkResultUiInteraction clears NO_ACCESSIBILITY_STATE_SET when state did change', async () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());

    await act(async () => {
      onAmaNodesCallback?.({
        1: makeNode({ type: 'Text', ariaRole: 'header', viewId: 1 }),
        100: makeNode({ type: 'Pressable', viewId: 100, ariaRole: 'button', ariaLabel: 'Toggle', traits: ['button'] }),
      });
    });

    const snapshot = { label: 'Toggle', role: 'button', isChecked: false, isBusy: false, isSelected: false, isDisabled: false, isExpanded: false, parentId: 0 };

    await act(async () => {
      onUIInteractionCallback?.({
        rootTag: 100,
        beforeModalVisible: false,
        afterModalVisible: false,
        before: { 100: { ...snapshot, isChecked: false, label: 'changed' } },
        after: { 100: { ...snapshot, isChecked: true } },
        afterSettled: { 100: { ...snapshot, isChecked: true } },
      });
    });

    expect(result.current.issues.some((i: any) => i.rule === 'NO_ACCESSIBILITY_STATE_SET')).toBe(false);
  });

  it('checkResultUiInteraction does nothing when rootTag is not in afterKeys', async () => {
    const { useAMADev } = require('./useAMADev');
    const { result } = renderHook(() => useAMADev!());

    await act(async () => {
      onUIInteractionCallback?.({
        rootTag: 999,
        beforeModalVisible: false,
        afterModalVisible: false,
        before: {},
        after: { 1: { label: 'btn' } },
        afterSettled: null,
      });
    });

    expect(result.current.issues.some((i: any) => i.rule === 'NO_ACCESSIBILITY_STATE_SET')).toBe(false);
  });

});
