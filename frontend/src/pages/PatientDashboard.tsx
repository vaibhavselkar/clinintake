import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, LogOut, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBriefsByPatient } from '../services/firestore.service';
import { SavedBrief } from '../types/auth.types';
import { useBriefStore } from '../store/brief.store';

export function PatientDashboard() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();
  const setBrief = useBriefStore((s) => s.setBrief);
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    getBriefsByPatient(appUser.uid)
      .then(setBriefs)
      .finally(() => setLoading(false));
  }, [appUser]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function openBrief(b: SavedBrief) {
    setBrief(b.brief);
    navigate('/brief');
  }

  return (
    <div className="min-h-screen bg-[#F0FAF4]">
      <header className="bg-white border-b border-[#C8E6D4] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-['Lora'] text-lg font-semibold text-[#0D2818]">ClinIntake</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#3D6B50]">
            <User className="w-4 h-4" />
            <span>{appUser?.displayName}</span>
          </div>
          <button
            onClick={() => navigate('/intake')}
            className="flex items-center gap-1.5 bg-[#1B6B3A] hover:bg-[#0F4023] text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Intake
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-[#7A9E87] hover:text-[#991B1B] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="font-['Lora'] text-2xl font-semibold text-[#0D2818]">
            My Intake History
          </h1>
          <p className="text-sm text-[#7A9E87] mt-0.5">
            {briefs.length} past session{briefs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#7A9E87]">Loading your history…</div>
        ) : briefs.length === 0 ? (
          <div className="bg-white border border-[#C8E6D4] rounded-xl p-12 text-center">
            <Clock className="w-10 h-10 text-[#C8E6D4] mx-auto mb-3" />
            <p className="text-[#3D6B50] font-medium mb-1">No sessions yet</p>
            <p className="text-sm text-[#7A9E87] mb-4">
              Complete an intake interview and your brief will appear here.
            </p>
            <button
              onClick={() => navigate('/intake')}
              className="bg-[#1B6B3A] hover:bg-[#0F4023] text-white text-sm font-semibold rounded-lg px-5 py-2 transition-colors"
            >
              Start your first intake
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map((b) => (
              <button
                key={b.id}
                onClick={() => openBrief(b)}
                className="w-full text-left bg-white border border-[#C8E6D4] rounded-xl p-5 hover:border-[#1B6B3A] hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#3D6B50]">
                    {new Date(b.createdAt).toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-[#E8F5EE] text-[#1B6B3A] px-2 py-0.5 rounded-full">
                      {b.oldcartsCount}/8 HPI
                    </span>
                    <span className="bg-[#E8F5EE] text-[#1B6B3A] px-2 py-0.5 rounded-full">
                      {b.rosCount}/6 ROS
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#0D2818] font-medium mb-1">
                  "{b.chiefComplaint}"
                </p>
                <p className="text-xs text-[#7A9E87] line-clamp-2">{b.hpi}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
