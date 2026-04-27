export function buildExtractionPrompt(conversationText: string): string {
  return `You are a clinical data extractor. Read the following patient conversation excerpt and extract any newly stated clinical information.

Return ONLY a valid JSON object with these exact keys. Set a field to null if the patient did NOT clearly state that information. Be conservative — only populate a field if the patient explicitly provided the information in this conversation.

JSON structure:
{
  "chiefComplaint": string | null,
  "onset": string | null,
  "location": string | null,
  "duration": string | null,
  "character": string | null,
  "aggravatingAlleviating": string | null,
  "radiation": string | null,
  "timing": string | null,
  "severity": string | null,
  "rosConstitutional": string | null,
  "rosCardiovascular": string | null,
  "rosRespiratory": string | null,
  "rosGastrointestinal": string | null,
  "rosNeurological": string | null,
  "rosMusculoskeletal": string | null,
  "pmh": string | null,
  "medications": string | null,
  "allergies": string | null
}

Rules:
- chiefComplaint: the patient's main reason for the visit in their own words
- onset: when symptoms started and what triggered them
- location: where exactly the symptom is located on the body
- duration: how long symptoms last / how long they've been present
- character: what the symptom feels like (quality/description)
- aggravatingAlleviating: what makes it better AND what makes it worse (combine both)
- radiation: whether the symptom spreads to other areas
- timing: pattern (constant vs intermittent, time of day patterns)
- severity: numeric score (0-10) or description of severity
- rosConstitutional: fever, fatigue, weight changes, sweats, chills
- rosCardiovascular: palpitations, chest pain, edema, syncope
- rosRespiratory: dyspnea, cough, wheezing
- rosGastrointestinal: nausea, vomiting, bowel changes, abdominal pain
- rosNeurological: headache, dizziness, focal deficits, altered sensation
- rosMusculoskeletal: joint pain, swelling, muscle symptoms
- pmh: past medical conditions/diagnoses
- medications: drugs, doses, and frequency
- allergies: drug allergies and reactions

CONVERSATION:
${conversationText}

Respond with ONLY the JSON object. No markdown, no explanation, no code fences.`;
}
