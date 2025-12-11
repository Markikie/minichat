'use client';

import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export default function ChatInput({ onSend, isLoading, onClear }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading && trimmedInput.length <= 500) {
      onSend(trimmedInput);
      setInput('');
    }
  };

  const remainingChars = 500 - input.length;
  const canSend = input.trim().length > 0 && !isLoading && input.length <= 500;

  return (
    <div className="border-t border-gray-300 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message (max 500 characters)..."
            maxLength={500}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <div className="text-xs text-gray-500 mt-1">
            {remainingChars} characters remaining
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className="px-6 h-10 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap"
        >
          Send
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="px-4 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm whitespace-nowrap"
          title="Clear all messages"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
      </form>
    </div>
  );
}

