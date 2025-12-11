export const OLLAMA_CONFIG = {
  url: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3',
  timeout: parseInt(process.env.OLLAMA_TIMEOUT || '300000', 10), // 5 minutes default (300 seconds)
};

