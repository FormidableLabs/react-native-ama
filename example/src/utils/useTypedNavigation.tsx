import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../types';

export const useTypedNavigation = () =>
  useNavigation<StackNavigationProp<RootStackParamList>>();
