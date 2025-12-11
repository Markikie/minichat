import { SessionRepository } from '../repository/SessionRepository';
import { MessageRepository } from '../repository/MessageRepository';
import { DatabaseError } from '../errors/AppError';

export interface Session {
  sessionId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export class SessionService {
  private sessionRepository: SessionRepository;
  private messageRepository: MessageRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
    this.messageRepository = new MessageRepository();
  }

  async createSession(title?: string): Promise<Session> {
    try {
      const session = await this.sessionRepository.createSession(title);
      return {
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messageCount,
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to create session: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getAllSessions(): Promise<Session[]> {
    try {
      const sessions = await this.sessionRepository.getAllSessions();
      return sessions.map((session) => ({
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messageCount,
      }));
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch sessions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const session = await this.sessionRepository.getSession(sessionId);
      if (!session) {
        return null;
      }
      return {
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messageCount,
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch session: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<Session> {
    try {
      const session = await this.sessionRepository.updateSessionTitle(sessionId, title);
      if (!session) {
        throw new DatabaseError('Session not found');
      }
      return {
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messageCount,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update session: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      // Delete all messages in the session first
      await this.messageRepository.clearMessages(sessionId);
      // Then delete the session
      await this.sessionRepository.deleteSession(sessionId);
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete session: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

