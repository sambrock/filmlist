'use client';

import type { Message, RecommendationWithMovie } from '@/lib/drizzle/zod';
import { type DeepPartial } from '@/lib/utils';
import { ChatMessageMovie } from './chat-message-movie';

type Props = {
  message: Partial<Message>;
  recommendations?: DeepPartial<RecommendationWithMovie>[];
};

export const ChatMessageAssistant = ({ recommendations = [] }: Props) => {
  return (
    <div className="space-y-2 pt-8 pb-4">
      {recommendations.map((recommendation, index) => (
        <ChatMessageMovie
          key={index}
          title={recommendation.title}
          releaseYear={recommendation.releaseYear}
          why={recommendation.why}
          movie={recommendation.movie}
        />
      ))}
    </div>
  );
};
