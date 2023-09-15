import { Pressable, type PressableProps } from '@react-native-ama/core';
import React from 'react';

import { useExpandable } from '../hooks/useExpandable';
import type { UseExpandable } from '../hooks/useExpandable';

type ExpandablePressableProps = React.PropsWithChildren<
  UseExpandable<PressableProps>
>;

const ExpandablePressableBase = ({
  children,
  ...rest
}: ExpandablePressableProps) => {
  const expandableProps = useExpandable<PressableProps>(rest);

  return <Pressable {...expandableProps}>{children}</Pressable>;
};

export const ExpandablePressable = React.memo(ExpandablePressableBase);
