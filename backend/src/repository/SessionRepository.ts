import { SessionModel, SessionDocument } from '../models/Session';
import { v4 as uuidv4 } from 'uuid';

export class SessionRepository {
  async createSession(title?: string): Promise<SessionDocument> {
    const session = new SessionModel({
      sessionId: uuidv4(),
      title: title || 'New Chat',
      messageCount: 0,
    });
    return await session.save();
  }

  async getSession(sessionId: string): Promise<SessionDocument | null> {
    return await SessionModel.findOne({ sessionId }).exec();
  }

  async getAllSessions(): Promise<SessionDocument[]> {
    return await SessionModel.find()
      .sort({ updatedAt: -1 })
      .exec();
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<SessionDocument | null> {
    return await SessionModel.findOneAndUpdate(
      { sessionId },
      { title, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async incrementMessageCount(sessionId: string): Promise<void> {
    await SessionModel.findOneAndUpdate(
      { sessionId },
      { $inc: { messageCount: 1 }, updatedAt: new Date() }
    ).exec();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await SessionModel.findOneAndDelete({ sessionId }).exec();
  }
}

