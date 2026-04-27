export interface ClinicalTruth {
  chiefComplaint: string;
  onset: string;
  location: string;
  duration: string;
  character: string;
  aggravating: string;
  alleviating: string;
  radiation: string;
  timing: string;
  severity: string;
  rosConstitutional: string;
  rosCardiovascular: string;
  rosRespiratory: string;
  rosGastrointestinal: string;
  rosNeurological: string;
  rosMusculoskeletal: string;
  pmh: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  socialHistory: string;
  redFlags: string[];
}

export interface PatientProfile {
  key: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  chiefComplaintHint: string;
  personality: string;
  clinicalTruth: ClinicalTruth;
}
