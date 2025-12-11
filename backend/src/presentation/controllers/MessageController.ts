import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../../service/MessageService';
import { ValidationError } from '../../errors/AppError';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content } = req.body;

      // Basic validation - detailed validation is in service layer
      if (content === undefined || content === null) {
        throw new ValidationError('Message content is required');
      }

      const aiMessage = await this.messageService.sendMessage(content);
      res.status(200).json({
        success: true,
        data: aiMessage,
      });
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await this.messageService.getAllMessages();
      res.status(200).json({
        success: true,
        data: messages,
        count: messages.length,
      });
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }

  async clearMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.messageService.clearMessages();
      res.status(200).json({
        success: true,
        message: 'All messages cleared successfully',
      });
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }
}

