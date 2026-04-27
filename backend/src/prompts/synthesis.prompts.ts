import { IntakeSession } from '../models/session.model';
import { ROS_LABELS, ROS_SYSTEMS } from '../models/clinical.model';

export function buildSynthesisPrompt(session: IntakeSession): string {
  const { collectedData, profile } = session;
  const transcript = session.conversationHistory
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'agent' ? 'RN' : 'Patient'}: ${m.content}`)
    .join('\n');

  const rosEntries = ROS_SYSTEMS.map((s) => {
    const label = ROS_LABELS[s];
    const val = collectedData.ros[s];
    return `${label}: ${val ?? 'Not reviewed'}`;
  }).join('\n');

  return `You are a clinical documentation specialist generating a structured pre-visit clinical brief for a physician.

PATIENT: ${profile.name}, ${profile.age}yo ${profile.sex}
CHIEF COMPLAINT COLLECTED: ${collectedData.chiefComplaint ?? 'Not stated'}

STRUCTURED DATA EXTRACTED FROM INTERVIEW:
- Onset: ${collectedData.oldcarts.onset ?? 'Not obtained'}
- Location: ${collectedData.oldcarts.location ?? 'Not obtained'}
- Duration: ${collectedData.oldcarts.duration ?? 'Not obtained'}
- Character: ${collectedData.oldcarts.character ?? 'Not obtained'}
- Aggravating/Alleviating: ${collectedData.oldcarts.aggravatingAlleviating ?? 'Not obtained'}
- Radiation: ${collectedData.oldcarts.radiation ?? 'Not obtained'}
- Timing: ${collectedData.oldcarts.timing ?? 'Not obtained'}
- Severity: ${collectedData.oldcarts.severity ?? 'Not obtained'}
- ROS Constitutional: ${collectedData.ros.rosConstitutional ?? 'Not reviewed'}
- ROS Cardiovascular: ${collectedData.ros.rosCardiovascular ?? 'Not reviewed'}
- ROS Respiratory: ${collectedData.ros.rosRespiratory ?? 'Not reviewed'}
- ROS Gastrointestinal: ${collectedData.ros.rosGastrointestinal ?? 'Not reviewed'}
- ROS Neurological: ${collectedData.ros.rosNeurological ?? 'Not reviewed'}
- ROS Musculoskeletal: ${collectedData.ros.rosMusculoskeletal ?? 'Not reviewed'}
- PMH/Conditions: ${collectedData.pmh ?? 'Not obtained'}
- Medications: ${collectedData.medications ?? 'Not obtained'}
- Allergies: ${collectedData.allergies ?? 'Not obtained'}

FULL INTERVIEW TRANSCRIPT:
${transcript}

---

Generate a structured clinical brief in EXACTLY this format. Follow every formatting rule precisely.

CHIEF COMPLAINT (CC)
[Write the patient's exact chief complaint in their own words, in quotation marks.]

HISTORY OF PRESENT ILLNESS (HPI)
[CRITICAL: Write a single flowing narrative paragraph of 4-6 sentences. Use third-person (he/she/they). Organize information using OLDCARTS structure but written as prose, NOT as a list or bullets. Use standard clinical abbreviations: c/o, h/o, denies, reports, +/-, Hx, PMHx, SOB, CP, N/V, etc. Include pertinent negatives explicitly — they are as important as positives. Format severity as X/10. Example of correct format: "Mr. [Name] is a [age]-year-old [sex] presenting c/o [CC]. Symptoms began [onset] and are described as [character], located [location], with a severity of [X]/10. The pain [radiates/does not radiate]. Symptoms are aggravated by [factors] and [partially/not] relieved by [factors]. The patient denies [pertinent negatives]."]

REVIEW OF SYSTEMS (ROS)
${rosEntries}

PAST MEDICAL & SOCIAL HISTORY
Conditions: [list all conditions with approximate duration, or "None reported"]
Medications: [drug name dose frequency, or "None reported"]
Allergies: [drug — reaction, or "NKDA"]
Family History: [findings, or "Not obtained"]
Social History: [smoking/alcohol/occupation/relevant factors, or "Not obtained"]

CLINICAL FLAGS
[List each urgent or concerning finding as a separate bullet starting with "•". Base flags ONLY on what was actually reported in this interview and the patient's specific risk profile. Do NOT use generic flags. If no flags exist, write "• No immediate red flags identified."]

DATA QUALITY NOTES
[Write 2-4 specific observations about information gaps. Name the exact OLDCARTS fields not obtained, which ROS systems were not reviewed, and 1-2 specific follow-up questions the physician should ask. Be concrete and actionable.]

---
FORMATTING RULES (MANDATORY):
- The HPI section MUST be a prose narrative paragraph — NEVER use bullets, lists, or field labels in the HPI
- Every section heading must appear exactly as shown above
- Clinical flags must be derived from this specific patient's data — not generic statements
- If data was not obtained, say "Not obtained" — do not fabricate or infer`;
}
