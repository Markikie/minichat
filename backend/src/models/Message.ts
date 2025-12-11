import mongoose, { Schema, Document } from 'mongoose';
import { Message } from '../types';

export interface MessageDocument extends Omit<Message, 'createdAt'>, Document {
  createdAt: Date;
}

const MessageSchema = new Schema<MessageDocument>({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: String,
    required: false,
  },
});

export const MessageModel = mongoose.model<MessageDocument>('Message', MessageSchema);

