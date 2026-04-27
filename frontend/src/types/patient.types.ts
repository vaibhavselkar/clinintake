export interface PatientSummary {
  key: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  chiefComplaintHint: string;
  personality: string;
}

export const PATIENT_LIST: PatientSummary[] = [
  { key: 'chest_pain_anxious', name: 'Robert Kim', age: 54, sex: 'male', chiefComplaintHint: 'Chest pain', personality: 'Anxious, catastrophizes' },
  { key: 'headache_stoic', name: 'Amara Osei', age: 31, sex: 'female', chiefComplaintHint: 'Severe headache', personality: 'Stoic, minimizes symptoms' },
  { key: 'knee_pain_elderly', name: 'Dorothy Walsh', age: 72, sex: 'female', chiefComplaintHint: 'Right knee pain', personality: 'Chatty, tangential' },
  { key: 'sob_cooperative', name: 'James Patel', age: 45, sex: 'male', chiefComplaintHint: 'Shortness of breath', personality: 'Cooperative, health-literate' },
  { key: 'abdominal_scared', name: 'Sofia Reyes', age: 28, sex: 'female', chiefComplaintHint: 'Abdominal pain', personality: 'Scared, uncertain' },
  { key: 'fatigue_minimizer', name: 'Harold Thompson', age: 67, sex: 'male', chiefComplaintHint: 'Fatigue & weight loss', personality: 'Minimizer, avoidant' },
];
