// 'use client';

// import { useMutationState } from '@tanstack/react-query';

// import { Message } from '@/lib/types';
// import { useChatStore } from '@/providers/chat-store-provider';
// import { useThreadMessages } from '@/hooks/api/useThreadMessages';
// import { AssistantMessage } from './messages/assistant-message';
// import { UserMessage } from './messages/user-message';

// export const ChatMessages = () => {
//   const threadId = useChatStore((state) => state.threadId);
//   const messagesQuery = useThreadMessages(threadId);
//   const pending = useMutationState({
//     filters: { mutationKey: ['sendMessage'] },
//   });
//   const variables = useMutationState<Message>({
//     filters: { mutationKey: ['sendMessage'], status: 'pending' },
//     select: (mutation) => mutation.state.variables as Message,
//   });

//   console.log(pending, variables);
//   const messages = [...messagesQuery.data, ...variables];
//   console.log('ChatMessages messages:', messages);

//   // console.log('ChatMessages variables:', variables);

//   return (
//     <div className="space-y-6 pb-40">
//       {messages.map((message) =>
//         message.role === 'user' ? (
//           <UserMessage key={message.messageId} message={message} />
//         ) : (
//           <AssistantMessage key={message.messageId} message={message} />
//         )
//       )}
//     </div>
//   );
// };
