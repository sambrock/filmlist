import { useMutation } from '@tanstack/react-query';

export const useInitialize = () => {
  return useMutation({
    mutationFn: async () => {
      await fetch('/api/initialize', { method: 'POST' });
    },
  });
};
