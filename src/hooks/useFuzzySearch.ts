import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface UseFuzzySearchOptions {
  threshold?: number;
  distance?: number;
  includeScore?: boolean;
  keys: string[];
}

const useFuzzySearch = <T>(data: T[], filter: string, options: UseFuzzySearchOptions): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    if (filter) {
      const fuse = new Fuse(data, {
        ...options
      });

      const result = fuse.search(filter);
      setFilteredData(result.map(({ item }) => item));
    } else {
      setFilteredData(data);
    }
  }, [data, filter, options]);

  return filteredData;
};

export default useFuzzySearch;
