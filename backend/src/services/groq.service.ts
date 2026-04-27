import Groq from 'groq-sdk';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export const AGENT_MODEL = 'llama-3.3-70b-versatile';
export const EXTRACTOR_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model: string;
  maxTokens?: number;
  temperature?: number;
}

const groqClient = new Groq({
  apiKey: config.groqApiKey,
});

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const RETRY_STATUS_CODES = new Set([429, 503]);

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function chat(
  messages: ChatMessage[],
  systemPrompt: string,
  options: ChatOptions
): Promise<string> {
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await Promise.race([
        groqClient.chat.completions.create({
          model: options.model,
          messages: fullMessages,
          max_tokens: options.maxTokens ?? 512,
          temperature: options.temperature ?? 0.7,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT_MS)
        ),
      ]);

      const usage = response.usage;
      if (usage) {
        logger.debug(`Groq token usage — model: ${options.model}, prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens}, total: ${usage.total_tokens}`);
      }

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from Groq API');
      }

      return content;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      const isRetryable =
        lastError.message.includes('timeout') ||
        RETRY_STATUS_CODES.has((err as { status?: number }).status ?? 0);

      if (!isRetryable || attempt === MAX_RETRIES) {
        logger.error(`Groq API error (attempt ${attempt}/${MAX_RETRIES}): ${lastError.message}`);
        throw lastError;
      }

      const backoffMs = Math.pow(2, attempt) * 500;
      logger.warn(`Groq API error (attempt ${attempt}/${MAX_RETRIES}), retrying in ${backoffMs}ms: ${lastError.message}`);
      await sleep(backoffMs);
    }
  }

  throw lastError ?? new Error('Unknown Groq API error');
}

export type { ChatMessage };
