import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/session.store';
import { useIntakeStore } from '../store/intake.store';
import { useBriefStore } from '../store/brief.store';
import { useVoiceManager } from './useVoiceManager';
import {
  createSession,
  runAgentTurn,
  runPatientTurn,
  synthesizeBrief,
} from '../services/api.service';
import { saveBrief } from '../services/firestore.service';
import { auth } from '../lib/firebase';
import { IntakePhase, PHASE_LABELS } from '../types/clinical.types';

const AUTO_LOOP_DELAY_MS = 700;

export interface UseIntakeSessionReturn {
  initialize: (patientKey: string) => Promise<void>;
  triggerManualReply: (reply: string) => Promise<void>;
  generateBrief: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  voice: ReturnType<typeof useVoiceManager>;
  clearError: () => void;
}

export function useIntakeSession(): UseIntakeSessionReturn {
  const navigate = useNavigate();
  const sessionStore = useSessionStore();
  const intakeStore = useIntakeStore();
  const briefStore = useBriefStore();
  const voice = useVoiceManager();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAutoLoopActive = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  function addSystemMessage(content: string): void {
    intakeStore.addMessage({ role: 'system', content, timestamp: new Date().toISOString() });
  }

  const handlePhaseChange = useCallback((prev: IntakePhase, next: IntakePhase) => {
    if (prev !== next) {
      addSystemMessage(`— Phase: ${PHASE_LABELS[next]} —`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doAgentTurn = useCallback(async (sessionId: string): Promise<{ response: string; phase: IntakePhase; phaseChanged: boolean }> => {
    intakeStore.setAgentThinking(true);
    intakeStore.setStatusText('Agent is thinking…');
    try {
      const result = await runAgentTurn(sessionId);
      intakeStore.addMessage({ role: 'agent', content: result.response, timestamp: new Date().toISOString() });
      intakeStore.setTurnCount(result.turnCount);

      if (result.phaseChanged) {
        handlePhaseChange(intakeStore.phase, result.phase);
        intakeStore.setPhase(result.phase);
      }

      intakeStore.setStatusText('Agent is speaking…');
      await voice.speakAgent(result.response);
      intakeStore.setStatusText('');
      return result;
    } finally {
      intakeStore.setAgentThinking(false);
    }
  }, [intakeStore, voice, handlePhaseChange]);

  const doPatientTurn = useCallback(async (sessionId: string, reply?: string): Promise<void> => {
    intakeStore.setPatientThinking(true);
    intakeStore.setStatusText('Patient is responding…');
    try {
      const result = await runPatientTurn(sessionId, reply ?? '', reply !== undefined);
      intakeStore.addMessage({ role: 'patient', content: result.patientReply, timestamp: new Date().toISOString() });
      intakeStore.setCollectedData(result.collectedData, result.oldcartsCount, result.rosCount);

      intakeStore.setStatusText('Patient is speaking…');
      await voice.speakPatient(result.patientReply);
      intakeStore.setStatusText('');
    } finally {
      intakeStore.setPatientThinking(false);
    }
  }, [intakeStore, voice]);

  const autoLoop = useCallback(async (sessionId: string): Promise<void> => {
    if (!isAutoLoopActive.current) return;

    try {
      const agentResult = await doAgentTurn(sessionId);
      if (!isAutoLoopActive.current) return;

      if (agentResult.phase === 'CLOSING' || intakeStore.turnCount >= 30) {
        isAutoLoopActive.current = false;
        intakeStore.setStatusText('Interview complete. Ready to generate brief.');
        return;
      }

      await new Promise((r) => setTimeout(r, AUTO_LOOP_DELAY_MS));
      if (!isAutoLoopActive.current) return;

      await doPatientTurn(sessionId);
      if (!isAutoLoopActive.current) return;

      await new Promise((r) => setTimeout(r, AUTO_LOOP_DELAY_MS));
      autoLoop(sessionId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('429') || msg.includes('Too many')) {
        intakeStore.setStatusText('Rate limited — retrying in 3 seconds…');
        await new Promise((r) => setTimeout(r, 3000));
        autoLoop(sessionId);
      } else {
        setError(`Interview error: ${msg}`);
        isAutoLoopActive.current = false;
      }
    }
  }, [doAgentTurn, doPatientTurn, intakeStore]);

  const initialize = useCallback(async (patientKey: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    intakeStore.reset();
    briefStore.reset();

    try {
      const session = await createSession(patientKey);
      sessionIdRef.current = session.sessionId;
      sessionStore.setSessionInfo({
        sessionId: session.sessionId,
        patientName: session.patientName,
        patientAge: session.patientAge,
        patientSex: session.patientSex,
        chiefComplaintHint: session.chiefComplaintHint,
        startedAt: new Date().toISOString(),
      });

      const mode = sessionStore.mode;
      if (mode === 'auto') {
        isAutoLoopActive.current = true;
        setIsLoading(false);
        autoLoop(session.sessionId);
      } else {
        setIsLoading(false);
        await doAgentTurn(session.sessionId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      setIsLoading(false);
    }
  }, [sessionStore, intakeStore, briefStore, autoLoop, doAgentTurn]);

  const triggerManualReply = useCallback(async (reply: string): Promise<void> => {
    const sessionId = sessionIdRef.current ?? sessionStore.sessionInfo?.sessionId;
    if (!sessionId) return;

    try {
      await doPatientTurn(sessionId, reply);
      await new Promise((r) => setTimeout(r, AUTO_LOOP_DELAY_MS));
      await doAgentTurn(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing reply');
    }
  }, [sessionStore.sessionInfo?.sessionId, doPatientTurn, doAgentTurn]);

  const generateBrief = useCallback(async (): Promise<void> => {
    const sessionId = sessionIdRef.current ?? sessionStore.sessionInfo?.sessionId;
    if (!sessionId) return;

    isAutoLoopActive.current = false;
    voice.stopSpeaking();

    briefStore.setGenerating(true);
    intakeStore.setStatusText('Generating clinical brief…');

    try {
      const result = await synthesizeBrief(sessionId);
      briefStore.setBrief(result.brief);

      // Auto-save to Firestore if user is signed in
      const user = auth.currentUser;
      const info = sessionStore.sessionInfo;
      const intake = useIntakeStore.getState();
      if (user && info) {
        try {
          await saveBrief({
            sessionId,
            patientUid: user.uid,
            patientName: info.patientName,
            patientAge: info.patientAge,
            patientSex: info.patientSex,
            chiefComplaint: result.brief.chiefComplaint,
            hpi: result.brief.hpi,
            clinicalFlags: result.brief.clinicalFlags,
            oldcartsCount: intake.oldcartsCount,
            rosCount: intake.rosCount,
            turnCount: intake.turnCount,
            brief: result.brief,
            createdBy: user.uid,
          });
        } catch {
          // Save failure is non-fatal — brief is still shown
        }
      }

      navigate('/brief');
    } catch (err) {
      briefStore.setError(err instanceof Error ? err.message : 'Failed to generate brief');
      intakeStore.setStatusText('');
    }
  }, [sessionStore.sessionInfo, briefStore, intakeStore, voice, navigate]);

  return {
    initialize,
    triggerManualReply,
    generateBrief,
    isLoading,
    error,
    voice,
    clearError: () => setError(null),
  };
}
