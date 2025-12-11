'use client';

import { useState, useEffect, useRef } from 'react';
import { api, Message } from '../lib/api';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom with improved behavior
  const scrollToBottom = (forceInstant = false) => {
    if (messagesEndRef.current) {
      if (forceInstant) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    // Smooth scroll when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Instant scroll when loading starts (for better UX)
    if (isLoading) {
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [isLoading]);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const loadedMessages = await api.getMessages();
      setMessages(loadedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  const handleSend = async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Optimistically add user message
      const userMessage: Message = {
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to backend and get AI response
      const aiMessage = await api.sendMessage(content);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all messages?')) {
      return;
    }

    try {
      await api.clearMessages();
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear messages');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4">
        <h1 className="text-2xl font-bold text-center">Mini Chat App</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start a conversation!
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-end mb-4">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mx-4 mb-2">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} onClear={handleClear} />
    </div>
  );
}

