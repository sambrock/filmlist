'use client';

import type { Message, RecommendationWithMovie } from '@/lib/drizzle';
import { ChatMessageRecommendation } from './chat-message-recommendation';

type Props = {
  message: Message;
  recommendations: RecommendationWithMovie[];
};

export const ChatMessageAssistant = ({ message, recommendations }: Props) => {
  return (
    <div className="space-y-2 pt-8 pb-4" data-message-id={message.messageId}>
      {recommendations.map((recommendation, index) => (
        <ChatMessageRecommendation key={index} recommendation={recommendation} />
      ))}
    </div>
  );
};
