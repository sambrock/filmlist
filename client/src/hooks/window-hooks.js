import { useLayoutEffect, useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useHasScrolled() {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = () => {
    setHasScrolled(window.pageYOffset !== 0)
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return hasScrolled;
}

export function usePageYOffset() {
  const [pageYOffset, setPageYOffset] = useState(0);

  const handleScroll = () => {
    setPageYOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return pageYOffset;
}

export function useReloadPageData() {
  return window.history.state.__scrollY ? true : false
}