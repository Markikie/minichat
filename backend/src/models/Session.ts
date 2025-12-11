import mongoose, { Schema, Document } from 'mongoose';

export interface SessionDocument extends Document {
  sessionId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

const SessionSchema = new Schema<SessionDocument>({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
});

// Update updatedAt before saving
SessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema);

