export interface Message {
  role: 'user' | 'ai';
  content: string;
  createdAt: Date;
  sessionId?: string;
}

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaRequest {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
}

export interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

