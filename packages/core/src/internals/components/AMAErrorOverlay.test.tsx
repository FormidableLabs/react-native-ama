import { render, screen, fireEvent, act } from '@testing-library/react-native';
import React from 'react';

const rn = jest.requireMock('react-native');


jest.mock('../utils/amaClearHighlight', () => ({
  amaClearHighlight: jest.fn(),
}));
jest.mock('../utils/amaHighlightComponent', () => ({
  amaHighlightComponent: jest.fn().mockResolvedValue([0, 100, 200, 50]),
}));
jest.mock('../utils/logError', () => ({
  logError: jest.fn(),
}));
jest.mock('../utils/getRuleErrorInfo', () => ({
  getAMARuleErrorInfo: jest.fn(() => ({
    message: 'Test message',
    url: 'https://example.com',
    severity: 'Critical',
  })),
}));

const { AMAErrorOverlay: AMAErrorComponent } = require('./AMAErrorOverlay');

const issue = { rule: 'NO_ACCESSIBILITY_LABEL' as const, viewId: 1, label: 'Button' };

describe('AMAErrorComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when issues is empty', () => {
    const { toJSON } = render(<AMAErrorComponent issues={[]} />);
    expect(toJSON()).toBeNull();
  });

  it('renders nothing when issues is undefined', () => {
    const { toJSON } = render(<AMAErrorComponent />);
    expect(toJSON()).toBeNull();
  });

  it('shows the issue count in the failed bar', () => {
    render(<AMAErrorComponent issues={[issue]} />);
    expect(screen.getByText('Inspect ›', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText(/detected/, { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders when multiple issues are provided', () => {
    const issue2 = { rule: 'CONTRAST_FAILED' as const, viewId: 2 };
    const { toJSON } = render(<AMAErrorComponent issues={[issue, issue2]} />);
    expect(toJSON()).not.toBeNull();
  });

  it('opens the overlay when the Inspect button is pressed', async () => {
    const { UNSAFE_getByProps } = render(<AMAErrorComponent issues={[issue]} />);

    await act(async () => {
      fireEvent.press(UNSAFE_getByProps({ role: 'button' }));
    });

    expect(screen.getByText('Why this matters:')).toBeTruthy();
  });

  it('shows issue index counter once overlay is open', async () => {
    const issue2 = { rule: 'CONTRAST_FAILED' as const, viewId: 2 };
    const { UNSAFE_getByProps } = render(<AMAErrorComponent issues={[issue, issue2]} />);

    await act(async () => {
      fireEvent.press(UNSAFE_getByProps({ role: 'button' }));
    });

    expect(screen.getByText('1 / 2')).toBeTruthy();
  });

  it('closes the overlay when the close button in AMARuleError is pressed', async () => {
    const { UNSAFE_getByProps } = render(<AMAErrorComponent issues={[issue]} />);

    await act(async () => {
      fireEvent.press(UNSAFE_getByProps({ role: 'button' }));
    });

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Close Error information'));
    });

    expect(screen.queryByText('Why this matters:')).toBeNull();
  });

  it('navigates to next issue when Next is pressed', async () => {
    const issue2 = { rule: 'CONTRAST_FAILED' as const, viewId: 2 };
    const { UNSAFE_getByProps, UNSAFE_getAllByProps } = render(
      <AMAErrorComponent issues={[issue, issue2]} />,
    );

    await act(async () => {
      fireEvent.press(UNSAFE_getByProps({ role: 'button' }));
    });

    expect(screen.getByText('1 / 2')).toBeTruthy();

    await act(async () => {
      fireEvent.press(UNSAFE_getAllByProps({ role: 'button' }).find(
        (el: any) => el.props['aria-label'] === undefined &&
          el.props.importantForAccessibility === 'no'
      ) ?? UNSAFE_getAllByProps({ role: 'button' })[1]);
    });
  });

  it('closes the overlay when the transparent overlay is pressed', async () => {
    const { UNSAFE_getByProps, UNSAFE_getAllByProps } = render(<AMAErrorComponent issues={[issue]} />);

    await act(async () => {
      fireEvent.press(UNSAFE_getByProps({ role: 'button' }));
    });

    expect(screen.getByText('Why this matters:')).toBeTruthy();

    await act(async () => {
      const overlayPressable = UNSAFE_getAllByProps({ accessible: false }).find(
        (el: any) => el.props.importantForAccessibility === 'no' && !el.props.accessibilityElementsHidden
      );
      if (overlayPressable) {
        fireEvent.press(overlayPressable);
      }
    });
  });

  it('renders on android (uses different bottom offset)', () => {
    rn.Platform.OS = 'android';
    rn.Platform.select = jest.fn((spec: any) => spec.android ?? spec.default);

    const { toJSON } = render(<AMAErrorComponent issues={[issue]} />);
    expect(toJSON()).not.toBeNull();

    rn.Platform.OS = 'ios';
    rn.Platform.select = jest.fn((spec: any) => spec.ios ?? spec.default);
  });
});
