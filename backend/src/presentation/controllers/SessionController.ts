import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../../service/SessionService';
import { ValidationError } from '../../errors/AppError';

export class SessionController {
  private sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title } = req.body;
      const session = await this.sessionService.createSession(title);
      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await this.sessionService.getAllSessions();
      res.status(200).json({
        success: true,
        data: sessions,
        count: sessions.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        throw new ValidationError('Session ID is required');
      }
      const session = await this.sessionService.getSession(sessionId);
      if (!session) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Session not found',
          },
          timestamp: new Date().toISOString(),
          path: req.path,
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { title } = req.body;
      
      if (!sessionId) {
        throw new ValidationError('Session ID is required');
      }
      if (!title || typeof title !== 'string') {
        throw new ValidationError('Title is required and must be a string');
      }
      
      const session = await this.sessionService.updateSessionTitle(sessionId, title);
      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        throw new ValidationError('Session ID is required');
      }
      await this.sessionService.deleteSession(sessionId);
      res.status(200).json({
        success: true,
        message: 'Session deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

