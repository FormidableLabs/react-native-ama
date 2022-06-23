import React from 'react';

import { UseExpandable, useExpandable } from '../hooks/useExpandable';
import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';

type ExpandablePressableProps = React.PropsWithChildren<
  UseExpandable<PressableProps>
>;

const ExpandablePressableBase = ({
  children,
  ...rest
}: ExpandablePressableProps) => {
  const expandableProps = useExpandable(rest);

  return <Pressable {...expandableProps}>{children}</Pressable>;
};

export const ExpandablePressable = React.memo(ExpandablePressableBase);
