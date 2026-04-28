import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SavedBrief } from '../types/auth.types';
import { ClinicalBrief } from '../types/clinical.types';

export interface SaveBriefPayload {
  sessionId: string;
  patientUid: string | null;
  patientName: string;
  patientAge: number;
  patientSex: string;
  chiefComplaint: string;
  hpi: string;
  clinicalFlags: string[];
  oldcartsCount: number;
  rosCount: number;
  turnCount: number;
  brief: ClinicalBrief;
  createdBy: string;
}

function toSavedBrief(id: string, data: Record<string, unknown>): SavedBrief {
  return {
    id,
    sessionId: data.sessionId as string,
    patientUid: (data.patientUid as string) ?? null,
    patientName: data.patientName as string,
    patientAge: data.patientAge as number,
    patientSex: data.patientSex as string,
    chiefComplaint: data.chiefComplaint as string,
    hpi: data.hpi as string,
    clinicalFlags: (data.clinicalFlags as string[]) ?? [],
    oldcartsCount: data.oldcartsCount as number,
    rosCount: data.rosCount as number,
    turnCount: data.turnCount as number,
    brief: data.brief as ClinicalBrief,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : (data.createdAt as string),
    createdBy: data.createdBy as string,
  };
}

export async function saveBrief(payload: SaveBriefPayload): Promise<string> {
  const ref = await addDoc(collection(db, 'briefs'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllBriefs(): Promise<SavedBrief[]> {
  // No orderBy to avoid needing an index — sort client-side
  const snap = await getDocs(collection(db, 'briefs'));
  const briefs = snap.docs.map((d) => toSavedBrief(d.id, d.data() as Record<string, unknown>));
  return briefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBriefsByPatient(patientUid: string): Promise<SavedBrief[]> {
  // Simple where query — no composite index needed, sort client-side
  const q = query(
    collection(db, 'briefs'),
    where('patientUid', '==', patientUid)
  );
  const snap = await getDocs(q);
  const briefs = snap.docs.map((d) => toSavedBrief(d.id, d.data() as Record<string, unknown>));
  return briefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBriefById(id: string): Promise<SavedBrief | null> {
  const snap = await getDoc(doc(db, 'briefs', id));
  if (!snap.exists()) return null;
  return toSavedBrief(snap.id, snap.data() as Record<string, unknown>);
}
