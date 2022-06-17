import React from 'react';

import { UseExpandable, useExpandable } from '../hooks/useExpandable';
import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';

type ExpandablePressableProps = UseExpandable<PressableProps>;

const ExpandablePressableBase: React.FC<ExpandablePressableProps> = ({
  children,
  ...rest
}) => {
  const expandableProps = useExpandable(rest);

  return <Pressable {...expandableProps}>{children}</Pressable>;
};

export const ExpandablePressable = React.memo(ExpandablePressableBase);
