const { configure } = require('@testing-library/react-native');

configure({
  hostComponentNames: {
    text: 'Text',
    textInput: 'TextInput',
    switch: 'Switch',
    modal: 'Modal',
    scrollView: 'ScrollView',
  },
});

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((spec) => spec.ios ?? spec.default),
  },
  AccessibilityInfo: {
    setAccessibilityFocus: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
    isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
    isReduceTransparencyEnabled: jest.fn().mockResolvedValue(false),
    isGrayscaleEnabled: jest.fn().mockResolvedValue(false),
    isBoldTextEnabled: jest.fn().mockResolvedValue(false),
    isInvertColorsEnabled: jest.fn().mockResolvedValue(false),
    isHighTextContrastEnabled: jest.fn().mockResolvedValue(false),
    isDarkerSystemColorsEnabled: jest.fn().mockResolvedValue(false),
    getRecommendedTimeoutMillis: jest.fn().mockResolvedValue(0),
  },
  findNodeHandle: jest.fn(),
  InteractionManager: {
    runAfterInteractions: jest.fn((callback) => callback?.()),
  },
  LayoutAnimation: {
    configureNext: jest.fn(),
  },
  AppState: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style),
  },
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Switch: 'Switch',
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  TouchableHighlight: 'TouchableHighlight',
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Modal: 'Modal',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  Image: 'Image',
  ActivityIndicator: 'ActivityIndicator',
  SafeAreaView: 'SafeAreaView',
  ViewPropTypes: {},
  Keyboard: { dismiss: jest.fn(), addListener: jest.fn(() => ({ remove: jest.fn() })) },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812, screen: { width: 375, height: 812 } })),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  LogBox: {
    ignoreAllLogs: jest.fn(),
    ignoreLogs: jest.fn(),
  },
  Animated: {
    Value: jest.fn(function(val) {
      this._value = val;
      this.interpolate = jest.fn(() => ({ _interpolation: true }));
      this.setValue = jest.fn();
    }),
    timing: jest.fn(() => ({ start: jest.fn() })),
    View: 'Animated.View',
    parallel: jest.fn(() => ({ start: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn() })),
  },
  DevSettings: {
    addMenuItem: jest.fn(),
  },
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: ({ children }) => children,
  GestureHandlerRootView: ({ children }) => children,
  ScrollView: 'ScrollView',
  Gesture: {
    Pan: jest.fn(() => ({
      onStart: jest.fn().mockReturnThis(),
      onActive: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    })),
  },
}));

jest.mock('react-native-reanimated', () => {
  const useSharedValue = jest.fn((val) => ({ value: val }));
  const useAnimatedStyle = jest.fn((fn) => fn());
  const useDerivedValue = jest.fn((fn) => ({ value: fn() }));
  const useReducedMotion = jest.fn(() => false);
  const withTiming = jest.fn((value) => value);
  const runOnJS = jest.fn((callback) => callback);
  const useAnimatedGestureHandler = jest.fn((p) => p);

  return {
    __esModule: true,
    default: {
      View: 'Animated.View',
    },
    useSharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useReducedMotion,
    withTiming,
    runOnJS,
    useAnimatedGestureHandler,
    SharedValue: undefined,
  };
});
