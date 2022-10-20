import * as React from 'react';

export class TestErrorBoundary extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.info(error, errorInfo);
  }

  render() {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      return null;
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}
