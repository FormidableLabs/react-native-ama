import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types';

export const useTypedNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
