import * as React from 'react';

export const DevOnly = () => {
  return (
    <span
      className="dev-only-wrap"
      title="The check is executed only when running the app in __DEV__ mode"
    >
      <span className="dev-only">DEV only check</span>
    </span>
  );
};
