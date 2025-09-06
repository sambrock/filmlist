'use client';

import { createContext, useContext } from 'react';

export const MessageContext = createContext<{ messageId: string } | undefined>(undefined);

export const MessageContextProvider = ({
  messageId,
  ...props
}: React.PropsWithChildren<{ messageId: string }>) => {
  return <MessageContext.Provider value={{ messageId }}>{props.children}</MessageContext.Provider>;
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error(`useMessageContext must be used within MessageContextProvider`);
  }

  return context;
};
