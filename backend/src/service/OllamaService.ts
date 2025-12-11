import axios, { AxiosError } from 'axios';
import { OLLAMA_CONFIG } from '../config/ollama';
import { OllamaRequest, OllamaResponse, OllamaMessage } from '../types';
import {
  OllamaServiceError,
  OllamaTimeoutError,
  OllamaConnectionError,
  OllamaModelNotFoundError,
} from '../errors/AppError';

export class OllamaService {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor() {
    this.baseUrl = OLLAMA_CONFIG.url;
    this.model = OLLAMA_CONFIG.model;
    this.timeout = OLLAMA_CONFIG.timeout;
  }

  async chat(messages: OllamaMessage[]): Promise<string> {
    try {
      const requestBody: OllamaRequest = {
        model: this.model,
        messages: messages,
        stream: false,
      };

      const response = await axios.post<OllamaResponse>(
        `${this.baseUrl}/api/chat`,
        requestBody,
        {
          timeout: this.timeout,
        }
      );

      if (response.data.done && response.data.message) {
        return response.data.message.content;
      }

      throw new OllamaServiceError('Invalid response from Ollama: response is not complete');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Connection refused - Ollama service not running
        if (axiosError.code === 'ECONNREFUSED') {
          throw new OllamaConnectionError();
        }
        
        // Timeout error
        if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
          throw new OllamaTimeoutError();
        }
        
        // Model not found
        if (axiosError.response?.status === 404) {
          throw new OllamaModelNotFoundError(this.model);
        }
        
        // Other HTTP errors
        if (axiosError.response) {
          const status = axiosError.response.status;
          const statusText = axiosError.response.statusText;
          throw new OllamaServiceError(
            `Ollama API returned ${status} ${statusText}`,
            status >= 500 ? 502 : status
          );
        }
        
        // Network errors
        throw new OllamaServiceError(
          `Network error: ${axiosError.message}`,
          503
        );
      }
      
      // Re-throw AppError instances
      if (error instanceof OllamaServiceError || 
          error instanceof OllamaTimeoutError ||
          error instanceof OllamaConnectionError ||
          error instanceof OllamaModelNotFoundError) {
        throw error;
      }
      
      // Unknown errors
      throw new OllamaServiceError(
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

