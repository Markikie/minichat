import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../errors/AppError';
import mongoose from 'mongoose';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
    [key: string]: unknown;
  };
  timestamp: string;
  path: string;
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle AppError (custom errors)
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(error.statusCode).json(response);
    return;
  }

  // Handle Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: Object.values(error.errors).map((err) => err.message),
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(400).json(response);
    return;
  }

  // Handle Mongoose cast errors
  if (error instanceof mongoose.Error.CastError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: ErrorCode.INVALID_INPUT,
        message: `Invalid ${error.path}: ${error.value}`,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(400).json(response);
    return;
  }

  // Handle unknown errors
  const response: ErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  res.status(500).json(response);
};

