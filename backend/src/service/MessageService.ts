import { MessageRepository } from '../repository/MessageRepository';
import { SessionRepository } from '../repository/SessionRepository';
import { OllamaService } from './OllamaService';
import { Message, OllamaMessage } from '../types';
import { ValidationError, DatabaseError } from '../errors/AppError';

export class MessageService {
  private messageRepository: MessageRepository;
  private sessionRepository: SessionRepository;
  private ollamaService: OllamaService;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.sessionRepository = new SessionRepository();
    this.ollamaService = new OllamaService();
  }

  async sendMessage(userContent: string, sessionId?: string): Promise<Message> {
    // Validate input
    if (!userContent || typeof userContent !== 'string') {
      throw new ValidationError('Message content is required and must be a string');
    }

    const trimmedContent = userContent.trim();
    if (trimmedContent.length === 0) {
      throw new ValidationError('Message content cannot be empty');
    }

    if (trimmedContent.length > 500) {
      throw new ValidationError('Message content cannot exceed 500 characters');
    }

    try {
      // Create or get session
      let currentSessionId = sessionId;
      if (currentSessionId) {
        const session = await this.sessionRepository.getSession(currentSessionId);
        if (!session) {
          // Session not found, create new one
          const newSession = await this.sessionRepository.createSession();
          currentSessionId = newSession.sessionId;
        }
      } else {
        // No sessionId provided, create new session
        const newSession = await this.sessionRepository.createSession();
        currentSessionId = newSession.sessionId;
      }

      // Save user message
      const userMessage = await this.messageRepository.saveMessage('user', trimmedContent, currentSessionId);

      // Update session message count
      if (currentSessionId) {
        await this.sessionRepository.incrementMessageCount(currentSessionId);
        // Update session title from first user message if it's still "New Chat"
        const session = await this.sessionRepository.getSession(currentSessionId);
        if (session && session.title === 'New Chat' && session.messageCount === 1) {
          const title = trimmedContent.length > 50 
            ? trimmedContent.substring(0, 50) + '...' 
            : trimmedContent;
          await this.sessionRepository.updateSessionTitle(currentSessionId, title);
        }
      }

      // Get conversation history
      const history = await this.messageRepository.getAllMessages(currentSessionId);

      // Convert to Ollama message format
      const ollamaMessages: OllamaMessage[] = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Get AI response from Ollama
      const aiContent = await this.ollamaService.chat(ollamaMessages);

      // Save AI message
      const aiMessage = await this.messageRepository.saveMessage('ai', aiContent, currentSessionId);

      // Update session message count again for AI message
      if (currentSessionId) {
        await this.sessionRepository.incrementMessageCount(currentSessionId);
      }

      // Return AI message with sessionId
      return {
        role: aiMessage.role,
        content: aiMessage.content,
        createdAt: aiMessage.createdAt,
        sessionId: aiMessage.sessionId || currentSessionId,
      };
    } catch (error) {
      // Re-throw validation and Ollama errors
      if (
        error instanceof ValidationError ||
        error instanceof DatabaseError ||
        (error instanceof Error && error.message?.includes('Ollama'))
      ) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to process message: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getAllMessages(sessionId?: string): Promise<Message[]> {
    try {
      const messages = await this.messageRepository.getAllMessages(sessionId);
      return messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
        sessionId: msg.sessionId,
      }));
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch messages: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async clearMessages(sessionId?: string): Promise<void> {
    try {
      await this.messageRepository.clearMessages(sessionId);
    } catch (error) {
      throw new DatabaseError(
        `Failed to clear messages: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

