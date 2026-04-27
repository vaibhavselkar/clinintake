import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  port: parseInt(optionalEnv('PORT', '3001'), 10),
  groqApiKey: requireEnv('GROQ_API_KEY'),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  corsOrigin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),
  sessionTtlHours: parseInt(optionalEnv('SESSION_TTL_HOURS', '2'), 10),
  logLevel: optionalEnv('LOG_LEVEL', 'info'),
} as const;

export type Config = typeof config;
