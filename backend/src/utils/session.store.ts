import { adminDb } from '../config/firebase';
import { IntakeSession } from '../models/session.model';
import { logger } from './logger';

const COLLECTION = 'intake_sessions';

function serialize(session: IntakeSession): Record<string, unknown> {
  return {
    ...session,
    createdAt: session.createdAt.toISOString(),
    lastActivity: session.lastActivity.toISOString(),
  };
}

function deserialize(data: Record<string, unknown>): IntakeSession {
  return {
    ...data,
    createdAt: new Date(data.createdAt as string),
    lastActivity: new Date(data.lastActivity as string),
  } as IntakeSession;
}

export const sessionStore = {
  async set(session: IntakeSession): Promise<void> {
    try {
      await adminDb.collection(COLLECTION).doc(session.id).set(serialize(session));
    } catch (err) {
      logger.error('sessionStore.set failed:', err);
      throw err;
    }
  },

  async get(id: string): Promise<IntakeSession | undefined> {
    try {
      const doc = await adminDb.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return undefined;
      const session = deserialize(doc.data() as Record<string, unknown>);
      session.lastActivity = new Date();
      // Update lastActivity without awaiting to keep reads fast
      adminDb.collection(COLLECTION).doc(id).update({ lastActivity: session.lastActivity.toISOString() }).catch(() => {});
      return session;
    } catch (err) {
      logger.error('sessionStore.get failed:', err);
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await adminDb.collection(COLLECTION).doc(id).delete();
      return true;
    } catch {
      return false;
    }
  },

  async has(id: string): Promise<boolean> {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    return doc.exists;
  },

  async size(): Promise<number> {
    const snap = await adminDb.collection(COLLECTION).count().get();
    return snap.data().count;
  },
};
