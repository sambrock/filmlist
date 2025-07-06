'use client';

import { useEffect, useRef } from 'react';

type Props = {
  fetchNextPage: () => void;
};

export const ChatMessagesFetchMore = ({ fetchNextPage }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage]);

  return <div ref={divRef} />;
};
