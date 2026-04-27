export const OLDCARTS_FIELDS = [
  'onset',
  'location',
  'duration',
  'character',
  'aggravatingAlleviating',
  'radiation',
  'timing',
  'severity',
] as const;

export type OLDCARTSField = (typeof OLDCARTS_FIELDS)[number];

export const ROS_SYSTEMS = [
  'rosConstitutional',
  'rosCardiovascular',
  'rosRespiratory',
  'rosGastrointestinal',
  'rosNeurological',
  'rosMusculoskeletal',
] as const;

export type ROSSystem = (typeof ROS_SYSTEMS)[number];

export const ROS_LABELS: Record<ROSSystem, string> = {
  rosConstitutional: 'Constitutional',
  rosCardiovascular: 'Cardiovascular',
  rosRespiratory: 'Respiratory',
  rosGastrointestinal: 'Gastrointestinal',
  rosNeurological: 'Neurological',
  rosMusculoskeletal: 'Musculoskeletal',
};

export const OLDCARTS_LABELS: Record<OLDCARTSField, string> = {
  onset: 'Onset',
  location: 'Location',
  duration: 'Duration',
  character: 'Character',
  aggravatingAlleviating: 'Aggravating / Alleviating',
  radiation: 'Radiation',
  timing: 'Timing',
  severity: 'Severity',
};

export interface CollectedClinicalData {
  chiefComplaint: string | null;
  oldcarts: Record<OLDCARTSField, string | null>;
  ros: Record<ROSSystem, string | null>;
  pmh: string | null;
  medications: string | null;
  allergies: string | null;
}

export interface ExtractionResult {
  chiefComplaint: string | null;
  onset: string | null;
  location: string | null;
  duration: string | null;
  character: string | null;
  aggravatingAlleviating: string | null;
  radiation: string | null;
  timing: string | null;
  severity: string | null;
  rosConstitutional: string | null;
  rosCardiovascular: string | null;
  rosRespiratory: string | null;
  rosGastrointestinal: string | null;
  rosNeurological: string | null;
  rosMusculoskeletal: string | null;
  pmh: string | null;
  medications: string | null;
  allergies: string | null;
}

export interface ClinicalBrief {
  chiefComplaint: string;
  hpi: string;
  ros: Record<ROSSystem, string>;
  pmh: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  socialHistory: string;
  clinicalFlags: string[];
  dataQualityNotes: string;
  generatedAt: string;
}

export function emptyCollectedData(): CollectedClinicalData {
  const oldcarts = {} as Record<OLDCARTSField, string | null>;
  for (const field of OLDCARTS_FIELDS) {
    oldcarts[field] = null;
  }
  const ros = {} as Record<ROSSystem, string | null>;
  for (const system of ROS_SYSTEMS) {
    ros[system] = null;
  }
  return {
    chiefComplaint: null,
    oldcarts,
    ros,
    pmh: null,
    medications: null,
    allergies: null,
  };
}

export function oldcartsCompletionCount(data: CollectedClinicalData): number {
  return OLDCARTS_FIELDS.filter((f) => data.oldcarts[f] !== null).length;
}

export function rosCompletionCount(data: CollectedClinicalData): number {
  return ROS_SYSTEMS.filter((s) => data.ros[s] !== null).length;
}
