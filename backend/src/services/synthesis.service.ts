import { IntakeSession } from '../models/session.model';
import { ClinicalBrief, ROS_SYSTEMS, ROS_LABELS } from '../models/clinical.model';
import { buildSynthesisPrompt } from '../prompts/synthesis.prompts';
import { chat, AGENT_MODEL } from './groq.service';
import { logger } from '../utils/logger';

function parseSynthesisOutput(raw: string, session: IntakeSession): ClinicalBrief {
  const lines = raw.split('\n');

  function extractSection(header: string): string {
    const startIdx = lines.findIndex((l) => l.trim().startsWith(header));
    if (startIdx === -1) return 'Not obtained';

    const result: string[] = [];
    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line.startsWith('CHIEF COMPLAINT') ||
        line.startsWith('HISTORY OF PRESENT') ||
        line.startsWith('REVIEW OF SYSTEMS') ||
        line.startsWith('PAST MEDICAL') ||
        line.startsWith('CLINICAL FLAGS') ||
        line.startsWith('DATA QUALITY')
      ) {
        break;
      }
      if (line) result.push(line);
    }
    return result.join('\n').trim() || 'Not obtained';
  }

  const hpiRaw = extractSection('HISTORY OF PRESENT ILLNESS');
  const rosRaw = extractSection('REVIEW OF SYSTEMS');
  const pmhRaw = extractSection('PAST MEDICAL & SOCIAL HISTORY');
  const flagsRaw = extractSection('CLINICAL FLAGS');
  const dqRaw = extractSection('DATA QUALITY NOTES');

  // Parse CC — extract quoted text if present
  const ccRaw = extractSection('CHIEF COMPLAINT (CC)');
  const ccMatch = ccRaw.match(/"([^"]+)"/);
  const chiefComplaint = ccMatch ? ccMatch[1] : ccRaw;

  // Parse ROS into per-system map
  const ros = {} as Record<(typeof ROS_SYSTEMS)[number], string>;
  for (const system of ROS_SYSTEMS) {
    const label = ROS_LABELS[system];
    const match = rosRaw.match(new RegExp(`${label}:\\s*(.+)`));
    ros[system] = match ? match[1].trim() : 'Not reviewed';
  }

  // Parse clinical flags — one per bullet
  const flags = flagsRaw
    .split('\n')
    .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
    .filter((l) => l.length > 0);

  // Parse PMH sub-fields
  const pmhLines: Record<string, string> = {};
  for (const line of pmhRaw.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      pmhLines[key] = val;
    }
  }

  return {
    chiefComplaint,
    hpi: hpiRaw,
    ros,
    pmh: pmhLines['Conditions'] ?? session.collectedData.pmh ?? 'Not obtained',
    medications: pmhLines['Medications'] ?? session.collectedData.medications ?? 'Not obtained',
    allergies: pmhLines['Allergies'] ?? session.collectedData.allergies ?? 'NKDA',
    familyHistory: pmhLines['Family History'] ?? 'Not obtained',
    socialHistory: pmhLines['Social History'] ?? 'Not obtained',
    clinicalFlags: flags,
    dataQualityNotes: dqRaw,
    generatedAt: new Date().toISOString(),
  };
}

export async function synthesizeClinicalBrief(session: IntakeSession): Promise<ClinicalBrief> {
  logger.info(`Synthesizing clinical brief for session ${session.id}`);

  const prompt = buildSynthesisPrompt(session);

  const raw = await chat([], prompt, {
    model: AGENT_MODEL,
    maxTokens: 1500,
    temperature: 0.3,
  });

  const brief = parseSynthesisOutput(raw, session);
  logger.info(`Clinical brief generated for session ${session.id}`);

  return brief;
}
