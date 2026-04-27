import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cross, ArrowLeft } from 'lucide-react';
import { useSessionStore } from '../store/session.store';
import { useIntakeStore } from '../store/intake.store';
import { useBriefStore } from '../store/brief.store';
import { useIntakeSession } from '../hooks/useIntakeSession';
import { PhaseIndicator } from '../components/interview/PhaseIndicator';
import { TranscriptPane } from '../components/interview/TranscriptPane';
import { ProgressTracker } from '../components/interview/ProgressTracker';
import { VoiceControls } from '../components/interview/VoiceControls';
import { StatusBar } from '../components/interview/StatusBar';

export function InterviewPage() {
  const navigate = useNavigate();
  const { selectedPatient, sessionInfo, mode } = useSessionStore();
  const { messages, phase, turnCount, collectedData, oldcartsCount, rosCount, isAgentThinking, isPatientThinking, statusText } = useIntakeStore();
  const { isGenerating } = useBriefStore();
  const { initialize, triggerManualReply, generateBrief, isLoading, error, voice, clearError } = useIntakeSession();
  const initCalled = useRef(false);

  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;
    if (!selectedPatient) {
      navigate('/');
      return;
    }
    if (!sessionInfo) {
      initialize(selectedPatient.key);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isProcessing = isAgentThinking || isPatientThinking || isLoading;

  function handleManualSubmit(text: string) {
    voice.resetTranscript();
    triggerManualReply(text);
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-[#C8E6D4] px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-[#7A9E87] hover:text-[#1B6B3A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1B6B3A] flex items-center justify-center">
              <Cross className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-[#0D2818] font-display">
              {sessionInfo?.patientName ?? selectedPatient?.name}
            </span>
          </div>
        </div>

        <PhaseIndicator currentPhase={phase} />

        <span className="text-xs text-[#7A9E87]">Turn {turnCount}</span>
      </div>

      {/* Status bar */}
      <StatusBar statusText={statusText} isLoading={isProcessing} />

      {/* Error bar */}
      {error && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#FEF2F2] border-b border-red-200">
          <span className="text-xs text-[#991B1B]">{error}</span>
          <button onClick={clearError} className="text-xs text-[#991B1B] underline">Dismiss</button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript — 60% */}
        <div className="flex-[3] flex flex-col border-r border-[#C8E6D4] overflow-hidden">
          <TranscriptPane
            messages={messages}
            patientName={sessionInfo?.patientName ?? selectedPatient?.name ?? 'Patient'}
            isAgentThinking={isAgentThinking}
            isPatientThinking={isPatientThinking}
          />

          <VoiceControls
            mode={mode}
            isSpeaking={voice.isSpeaking}
            isListening={voice.isListening}
            isProcessing={isProcessing}
            muted={voice.muted}
            rate={voice.rate}
            interimTranscript={voice.interimTranscript}
            transcript={voice.transcript}
            onStartListening={voice.startListening}
            onSubmitManual={handleManualSubmit}
            onToggleMute={() => voice.setMuted(!voice.muted)}
            onSetRate={voice.setRate}
            statusText={statusText}
          />
        </div>

        {/* Progress tracker — 40% */}
        <div className="flex-[2] bg-[#F0FAF4] overflow-hidden">
          <ProgressTracker
            collectedData={collectedData}
            oldcartsCount={oldcartsCount}
            rosCount={rosCount}
            onGenerateBrief={generateBrief}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
