import { useState, useEffect } from 'react'
import { useWindowSize } from './window-hooks';

export default function useColumns(startCols) {
  const [columns, setColumns] = useState();

  const [width] = useWindowSize();

  useEffect(() => {
    if (width > 1930) return setColumns(startCols + 1);
    if (width > 1536) return setColumns(startCols);
    if (width > 1280) return setColumns(5);
    if (width > 1024) return setColumns(4);
    if (width > 768) return setColumns(3);
    return setColumns(2);
  }, [width])

  return columns;
}