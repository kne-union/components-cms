import defaultTypes from './defaultTypes';
import { useMemo } from 'react';

const useCurrentTypes = types => {
  return useMemo(() => {
    const currentTypes = new Map(defaultTypes);
    (types || []).forEach(([name, target]) => {
      currentTypes.set(name, target);
    });
    return currentTypes;
  }, [types]);
};

export default useCurrentTypes;
