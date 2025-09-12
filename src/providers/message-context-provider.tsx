'use client';

import { createContext, useContext } from 'react';

import { Doc } from '@/infra/convex/_generated/dataModel';

export const MessageContext = createContext<{ message: Doc<'messages'> } | undefined>(undefined);

export const MessageContextProvider = ({
  message,
  ...props
}: React.PropsWithChildren<{ message: Doc<'messages'> }>) => {
  return <MessageContext.Provider value={{ message }}>{props.children}</MessageContext.Provider>;
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error(`useMessageContext must be used within MessageContextProvider`);
  }

  return context;
};
