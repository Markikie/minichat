export enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Service errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // External service errors (502, 503)
  OLLAMA_SERVICE_ERROR = 'OLLAMA_SERVICE_ERROR',
  OLLAMA_TIMEOUT = 'OLLAMA_TIMEOUT',
  OLLAMA_CONNECTION_ERROR = 'OLLAMA_CONNECTION_ERROR',
  OLLAMA_MODEL_NOT_FOUND = 'OLLAMA_MODEL_NOT_FOUND',
  
  // Not found (404)
  NOT_FOUND = 'NOT_FOUND',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(ErrorCode.VALIDATION_ERROR, message, 400);
  }
}

export class OllamaServiceError extends AppError {
  constructor(message: string, statusCode: number = 502) {
    super(ErrorCode.OLLAMA_SERVICE_ERROR, message, statusCode);
  }
}

export class OllamaTimeoutError extends AppError {
  constructor(message: string = 'Ollama request timed out. The model may be processing a large request. Please try again.') {
    super(ErrorCode.OLLAMA_TIMEOUT, message, 504);
  }
}

export class OllamaConnectionError extends AppError {
  constructor(message: string = 'Ollama service is not running. Please start Ollama first.') {
    super(ErrorCode.OLLAMA_CONNECTION_ERROR, message, 503);
  }
}

export class OllamaModelNotFoundError extends AppError {
  constructor(model: string) {
    super(
      ErrorCode.OLLAMA_MODEL_NOT_FOUND,
      `Model "${model}" not found. Please pull the model first using: ollama pull ${model}`,
      404
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(ErrorCode.DATABASE_ERROR, message, 500);
  }
}

