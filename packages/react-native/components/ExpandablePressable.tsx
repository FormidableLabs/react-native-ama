import React from 'react';
import type { PressableProps } from 'react-native-ama';

import { useExpandable } from '../hooks/useExpandable';
import type { UseExpandable } from '../hooks/useExpandable';
import { Pressable } from './Pressable';

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
