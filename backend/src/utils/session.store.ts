import { IntakeSession } from '../models/session.model';
import { config } from '../config/env';
import { logger } from './logger';

const TTL_MS = config.sessionTtlHours * 60 * 60 * 1000;

const store = new Map<string, IntakeSession>();

setInterval(() => {
  const now = Date.now();
  let expired = 0;
  for (const [id, session] of store) {
    if (now - session.lastActivity.getTime() > TTL_MS) {
      store.delete(id);
      expired++;
    }
  }
  if (expired > 0) {
    logger.info(`Session cleanup: removed ${expired} expired session(s). Active: ${store.size}`);
  }
}, 15 * 60 * 1000); // run every 15 minutes

export const sessionStore = {
  set(session: IntakeSession): void {
    store.set(session.id, session);
  },

  get(id: string): IntakeSession | undefined {
    const session = store.get(id);
    if (session) {
      session.lastActivity = new Date();
    }
    return session;
  },

  delete(id: string): boolean {
    return store.delete(id);
  },

  has(id: string): boolean {
    return store.has(id);
  },

  size(): number {
    return store.size;
  },
};
