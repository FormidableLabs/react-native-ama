import clsx from 'clsx';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ children, className }: Props) => {
  return (
    <div className={clsx('mx-8 lg:mx-16 xl:mx-32 my-12', className)}>
      {children}
    </div>
  );
};
