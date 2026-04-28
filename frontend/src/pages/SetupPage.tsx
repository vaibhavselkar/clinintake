import { useNavigate } from 'react-router-dom';
import { Cross, LogOut, LayoutDashboard } from 'lucide-react';
import { useSessionStore } from '../store/session.store';
import { PatientGrid } from '../components/setup/PatientGrid';
import { ModeSelector } from '../components/setup/ModeSelector';
import { HowItWorks } from '../components/setup/HowItWorks';
import { Button } from '../components/shared/Button';
import { PatientSummary } from '../types/patient.types';
import { useAuth } from '../context/AuthContext';

export function SetupPage() {
  const navigate = useNavigate();
  const { selectedPatient, mode, setSelectedPatient, setMode } = useSessionStore();
  const { appUser, logout } = useAuth();

  function handleBegin() {
    if (!selectedPatient) return;
    navigate('/interview');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const dashboardPath = appUser?.role === 'clinician' ? '/dashboard' : '/patient-dashboard';

  return (
    <div className="min-h-screen bg-[#F0FAF4]">
      {/* Top nav */}
      {appUser && (
        <div className="bg-white border-b border-[#C8E6D4] px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-[#3D6B50]">
            Welcome, <span className="font-medium text-[#0D2818]">{appUser.displayName}</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(dashboardPath)}
              className="flex items-center gap-1.5 text-sm text-[#3D6B50] hover:text-[#1B6B3A] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[#7A9E87] hover:text-[#991B1B] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#E8F5EE] to-[#F0FAF4] border-b border-[#C8E6D4] px-4 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B6B3A] flex items-center justify-center">
              <Cross className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0D2818] font-display">ClinIntake</h1>
          </div>
          <p className="text-[#3D6B50] text-sm mb-6">AI-Powered Pre-Visit Clinical Intake Agent</p>
          <HowItWorks />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Patient selection */}
        <div>
          <h2 className="text-base font-semibold text-[#0D2818] mb-1">Select Patient Scenario</h2>
          <p className="text-sm text-[#7A9E87] mb-4">Choose one of six clinical presentations to begin the intake interview.</p>
          <PatientGrid
            selectedKey={selectedPatient?.key ?? null}
            onSelect={(p: PatientSummary) => setSelectedPatient(p)}
          />
        </div>

        {/* Mode selector */}
        <div>
          <h2 className="text-base font-semibold text-[#0D2818] mb-1">Interview Mode</h2>
          <p className="text-sm text-[#7A9E87] mb-3">Choose how the patient responds during the interview.</p>
          <ModeSelector mode={mode} onChange={setMode} />
        </div>

        {/* Begin */}
        <div className="flex justify-end pb-6">
          <Button
            size="lg"
            onClick={handleBegin}
            disabled={!selectedPatient}
          >
            Begin Intake →
          </Button>
        </div>
      </div>
    </div>
  );
}
