import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

type UseFetchApi = {
  fetching: boolean;
  fetch: <T>(serviceFunc: Promise<T>) => Promise<T>;
};

const useFetchApi = (): UseFetchApi => {
  const [requestUuidList, setRequestUuidList] = useState<string[]>([]);

  const fetchCB = async <T>(
    servicePromise: Promise<T>,
    hasIndicator = true,
  ): Promise<T> => {
    const uuid = uuidv4();

    if (hasIndicator) {
      setRequestUuidList((list) => [...list, uuid]);
    }

    const result = await servicePromise;

    if (hasIndicator) {
      setRequestUuidList((list) => list.filter((rId) => rId !== uuid));
    }

    return result;
  };

  const fetch = useMemo(() => fetchCB, []);

  return {
    fetching: requestUuidList.length > 0,
    fetch,
  };
};

export default useFetchApi;
