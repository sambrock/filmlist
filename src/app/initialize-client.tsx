'use client';

import { useRef } from 'react';

import { useInitialize } from '@/lib/api/useInitialize';

export const InitializeClient = () => {
  const initRef = useRef(false);
  const { mutate } = useInitialize();
  if (!initRef.current) {
    initRef.current = true;
    mutate();
  }
  return null;
};
