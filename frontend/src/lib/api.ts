const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Message {
  role: 'user' | 'ai';
  content: string;
  createdAt: string;
  sessionId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  count?: number;
}

export const api = {
  async sendMessage(content: string): Promise<Message> {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const result: ApiResponse<Message> = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.error?.message || 'Failed to send message';
      throw new Error(errorMessage);
    }

    if (!result.data) {
      throw new Error('Invalid response format');
    }

    return result.data;
  },

  async getMessages(): Promise<Message[]> {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<Message[]> = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.error?.message || 'Failed to fetch messages';
      throw new Error(errorMessage);
    }

    // Return data array or empty array if data is undefined
    return result.data || [];
  },

  async clearMessages(): Promise<void> {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.error?.message || 'Failed to clear messages';
      throw new Error(errorMessage);
    }
  },
};

