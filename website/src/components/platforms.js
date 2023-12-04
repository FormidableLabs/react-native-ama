import * as React from 'react';

const PlatformTag = params => {
  return (
    <div className={`platform ${params.platform.toLowerCase()}`}>
      {params.platform}
    </div>
  );
};

export const iOS = () => {
  return <PlatformTag platform="iOS" />;
};

export const Android = () => {
  return <PlatformTag platform="Android" />;
};
