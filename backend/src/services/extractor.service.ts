import { ExtractionResult, CollectedClinicalData, OLDCARTS_FIELDS, ROS_SYSTEMS } from '../models/clinical.model';
import { buildExtractionPrompt } from '../prompts/extractor.prompts';
import { chat, EXTRACTOR_MODEL } from './groq.service';
import { logger } from '../utils/logger';

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

export async function extractClinicalData(
  agentMessage: string,
  patientReply: string
): Promise<Partial<ExtractionResult>> {
  const conversationText = `RN: ${agentMessage}\nPatient: ${patientReply}`;
  const prompt = buildExtractionPrompt(conversationText);

  try {
    const raw = await chat([], prompt, {
      model: EXTRACTOR_MODEL,
      maxTokens: 512,
      temperature: 0.1,
    });

    const cleaned = stripCodeFences(raw);
    const parsed = JSON.parse(cleaned) as Partial<ExtractionResult>;
    return parsed;
  } catch (err) {
    logger.warn(`Extraction failed, returning empty result: ${err instanceof Error ? err.message : String(err)}`);
    return {};
  }
}

export function mergeExtractionIntoSession(
  current: CollectedClinicalData,
  extracted: Partial<ExtractionResult>
): CollectedClinicalData {
  const updated = structuredClone(current);

  if (extracted.chiefComplaint) {
    updated.chiefComplaint = extracted.chiefComplaint;
  }

  for (const field of OLDCARTS_FIELDS) {
    const key = field as keyof ExtractionResult;
    const val = extracted[key];
    if (val && updated.oldcarts[field] === null) {
      updated.oldcarts[field] = val;
    }
  }

  for (const system of ROS_SYSTEMS) {
    const key = system as keyof ExtractionResult;
    const val = extracted[key];
    if (val && updated.ros[system] === null) {
      updated.ros[system] = val;
    }
  }

  if (extracted.pmh && updated.pmh === null) {
    updated.pmh = extracted.pmh;
  }
  if (extracted.medications && updated.medications === null) {
    updated.medications = extracted.medications;
  }
  if (extracted.allergies && updated.allergies === null) {
    updated.allergies = extracted.allergies;
  }

  return updated;
}
