export type IntakePhase =
  | 'GREETING'
  | 'CHIEF_COMPLAINT'
  | 'HPI_OLDCARTS'
  | 'ROS'
  | 'PMH'
  | 'CLOSING';

export const PHASE_LABELS: Record<IntakePhase, string> = {
  GREETING: 'Greeting',
  CHIEF_COMPLAINT: 'Chief Complaint',
  HPI_OLDCARTS: 'HPI',
  ROS: 'Review of Systems',
  PMH: 'Medical History',
  CLOSING: 'Closing',
};

export const PHASE_ORDER: IntakePhase[] = [
  'GREETING',
  'CHIEF_COMPLAINT',
  'HPI_OLDCARTS',
  'ROS',
  'PMH',
  'CLOSING',
];

export type MessageRole = 'agent' | 'patient' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export type OLDCARTSField =
  | 'onset'
  | 'location'
  | 'duration'
  | 'character'
  | 'aggravatingAlleviating'
  | 'radiation'
  | 'timing'
  | 'severity';

export const OLDCARTS_FIELDS: OLDCARTSField[] = [
  'onset', 'location', 'duration', 'character',
  'aggravatingAlleviating', 'radiation', 'timing', 'severity',
];

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

export type ROSSystem =
  | 'rosConstitutional'
  | 'rosCardiovascular'
  | 'rosRespiratory'
  | 'rosGastrointestinal'
  | 'rosNeurological'
  | 'rosMusculoskeletal';

export const ROS_SYSTEMS: ROSSystem[] = [
  'rosConstitutional', 'rosCardiovascular', 'rosRespiratory',
  'rosGastrointestinal', 'rosNeurological', 'rosMusculoskeletal',
];

export const ROS_LABELS: Record<ROSSystem, string> = {
  rosConstitutional: 'Constitutional',
  rosCardiovascular: 'Cardiovascular',
  rosRespiratory: 'Respiratory',
  rosGastrointestinal: 'Gastrointestinal',
  rosNeurological: 'Neurological',
  rosMusculoskeletal: 'Musculoskeletal',
};

export interface CollectedData {
  chiefComplaint: string | null;
  oldcarts: Record<OLDCARTSField, string | null>;
  ros: Record<ROSSystem, string | null>;
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
