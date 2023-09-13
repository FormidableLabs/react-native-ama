import * as React from 'react';

import { AMAContext } from '../components/AMAProvider';

export const useAMAContext = () => React.useContext(AMAContext);
