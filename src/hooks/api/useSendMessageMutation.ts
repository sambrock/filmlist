import { useMutation } from '@tanstack/react-query';

import { ChatMessage } from '@/lib/types';
import { useChatStore } from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const [threadExists, threadId] = useChatStore((state) => [state.threadExists, state.threadId]);
  const setMessage = useChatStore((state) => state.setMessage);

  return useMutation({
    mutationKey: ['sendMessage'],
    retry: false,
    mutationFn: async (userMessage: ChatMessage) => {
      console.log('threadExists', threadExists);
      // if (!threadExists) {
      //   await trpc.initThread.mutate({ threadId });
      // }

      setMessage(userMessage.messageId, userMessage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: userMessage.messageId,
          threadId: threadId,
          content: userMessage.content,
          model: userMessage.model,
        }),
      });

      if (!response.ok || !response.body) {
        console.error('Stream failed to start');
        return;
      }

      const decoder = new TextDecoder();
      const reader = response.body.getReader();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        let eventEnd;
        while ((eventEnd = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, eventEnd);
          buffer = buffer.slice(eventEnd + 2);

          const event = parseSSE(rawEvent);
          if (event?.event === 'content') {
            console.log('Content:', event.data);
          } else if (event?.event === 'movies') {
            console.log('Movies:', JSON.parse(event.data));
          } else if (event?.event === 'assistant-message') {
            console.log('Full assistant message:', JSON.parse(event.data));
          }
        }
      }

      // Simple SSE parser
      function parseSSE(eventString) {
        const lines = eventString.split('\n');
        const event = {};
        for (const line of lines) {
          if (line.startsWith('event:')) {
            event.event = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            event.data = (event.data || '') + line.slice(5).trim();
          }
        }
        return event;
      }

      // trpc.chat.subscribe(userMessage, {
      //   onData: (assistantMessage: string) => {
      //     const parsed = JSON.parse(assistantMessage) as ChatMessage;
      //     setMessage(parsed.messageId, parsed);
      //     console.log('content:', parsed.content);
      //   },
      //   onComplete: () => {
      //     console.log('complete');
      //   },
      //   onStopped: () => {},
      // });
    },
  });
};
