import { MessageModel, MessageDocument } from '../models/Message';
import { Message } from '../types';

export class MessageRepository {
  async saveMessage(role: 'user' | 'ai', content: string, sessionId?: string): Promise<MessageDocument> {
    const message = new MessageModel({
      role,
      content,
      sessionId,
      createdAt: new Date(),
    });
    return await message.save();
  }

  async getAllMessages(sessionId?: string): Promise<MessageDocument[]> {
    const query = sessionId ? { sessionId } : {};
    return await MessageModel.find(query).sort({ createdAt: 1 }).exec();
  }

  async clearMessages(sessionId?: string): Promise<void> {
    const query = sessionId ? { sessionId } : {};
    await MessageModel.deleteMany(query).exec();
  }

  async getMessagesBySession(sessionId: string): Promise<MessageDocument[]> {
    return await MessageModel.find({ sessionId }).sort({ createdAt: 1 }).exec();
  }
}

