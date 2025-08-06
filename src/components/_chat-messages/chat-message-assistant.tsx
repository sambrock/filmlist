'use client';

import type { MessageAssistant } from '@/drizzle';
import { ChatMessageRecommendation } from './chat-message-recommendation';

type Props = {
  message: MessageAssistant;
};

export const ChatMessageAssistant = ({ message }: Props) => {
  return (
    <div className="space-y-2 pt-8 pb-4">
      {message.recommendations.map((recommendation, index) => (
        <ChatMessageRecommendation key={index} recommendation={recommendation} />
      ))}
    </div>
  );
};
