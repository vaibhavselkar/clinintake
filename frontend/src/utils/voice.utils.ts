export type VoiceType = 'agent' | 'patient';

const AGENT_VOICE_PREFERENCES = [
  'Google UK English Female',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Karen',
  'Samantha',
];

const PATIENT_VOICE_PREFERENCES = [
  'Google US English',
  'Microsoft David Desktop - English (United States)',
  'Alex',
  'Daniel',
];

export function selectVoice(
  voices: SpeechSynthesisVoice[],
  type: VoiceType
): SpeechSynthesisVoice | null {
  const prefs = type === 'agent' ? AGENT_VOICE_PREFERENCES : PATIENT_VOICE_PREFERENCES;
  for (const pref of prefs) {
    const found = voices.find((v) => v.name === pref);
    if (found) return found;
  }
  // Fallback: first English voice
  const english = voices.find((v) => v.lang.startsWith('en'));
  return english ?? voices[0] ?? null;
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}
