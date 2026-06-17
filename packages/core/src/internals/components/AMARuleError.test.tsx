import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { AMARuleError } from './AMARuleError';

const rn = jest.requireMock('react-native');


const baseIssue = {
  rule: 'NO_ACCESSIBILITY_LABEL' as const,
  viewId: 1,
};

describe('AMARuleError', () => {
  it('renders the severity and issue title', () => {
    render(
      <AMARuleError issue={baseIssue} maxHeight={400} onClose={jest.fn()} />,
    );

    expect(screen.getByText(/Critical/)).toBeTruthy();
    expect(screen.getByText(/Missing accessibility label/i)).toBeTruthy();
  });

  it('renders "Why this matters" and "How to fix" sections', () => {
    render(
      <AMARuleError issue={baseIssue} maxHeight={400} onClose={jest.fn()} />,
    );

    expect(screen.getByText('Why this matters:')).toBeTruthy();
    expect(screen.getByText('How to fix:')).toBeTruthy();
  });

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn();
    render(<AMARuleError issue={baseIssue} maxHeight={400} onClose={onClose} />);

    fireEvent.press(screen.getByLabelText('Close Error information'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders extra text when provided', () => {
    const issue = { ...baseIssue, extra: 'extra context' };
    render(<AMARuleError issue={issue} maxHeight={400} onClose={jest.fn()} />);

    expect(screen.getByText(/extra context/)).toBeTruthy();
  });

  it('renders howToFix as multiple lines when it is an array', () => {
    render(
      <AMARuleError
        issue={{ rule: 'NO_ACCESSIBILITY_STATE_SET', viewId: 2 }}
        maxHeight={400}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(/aria-expanded/)).toBeTruthy();
  });

  it('renders backtick-wrapped code segments in the how-to-fix text', () => {
    render(
      <AMARuleError
        issue={{ rule: 'NO_ACCESSIBILITY_ROLE', viewId: 3 }}
        maxHeight={400}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(/aria-role="button"/, { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders contrast issue with extra color swatch text', () => {
    render(
      <AMARuleError
        issue={{ rule: 'CONTRAST_FAILED', viewId: 4, extra: 'ratio 2.1:1 (#fff on #eee)' }}
        maxHeight={400}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(/ratio 2.1:1/)).toBeTruthy();
  });

  it('renders Warning severity label', () => {
    render(
      <AMARuleError
        issue={{ rule: 'NO_UPPERCASE_ACCESSIBILITY_LABEL', viewId: 5 }}
        maxHeight={400}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(/Warning:/)).toBeTruthy();
  });
});
