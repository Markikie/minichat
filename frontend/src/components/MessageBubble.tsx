'use client';

import { Message } from '../lib/api';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="text-sm font-semibold mb-1">
          {isUser ? 'You' : 'AI'}
        </div>
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

