import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, AlertTriangle, LogOut, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllBriefs } from '../services/firestore.service';
import { SavedBrief } from '../types/auth.types';
import { useBriefStore } from '../store/brief.store';

export function ClinicianDashboard() {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();
  const setBrief = useBriefStore((s) => s.setBrief);
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBriefs()
      .then(setBriefs)
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function openBrief(b: SavedBrief) {
    setBrief(b.brief);
    navigate('/brief');
  }

  const filtered = briefs.filter(
    (b) =>
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.chiefComplaint.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0FAF4]">
      {/* Header */}
      <header className="bg-white border-b border-[#C8E6D4] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-['Lora'] text-lg font-semibold text-[#0D2818]">ClinIntake</span>
          <span className="ml-3 text-sm text-[#7A9E87]">Clinician Dashboard</span>
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Lora'] text-2xl font-semibold text-[#0D2818]">Intake Briefs</h1>
            <p className="text-sm text-[#7A9E87] mt-0.5">{briefs.length} total sessions on record</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9E87]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or complaint…"
              className="pl-9 pr-4 py-2 text-sm border border-[#C8E6D4] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#7A9E87]">Loading briefs…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#7A9E87]">
            {search ? 'No briefs match your search.' : 'No briefs saved yet. Run an intake to get started.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => openBrief(b)}
                className="w-full text-left bg-white border border-[#C8E6D4] rounded-xl p-5 hover:border-[#1B6B3A] hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-['Lora'] font-semibold text-[#0D2818] text-base">
                        {b.patientName}
                      </span>
                      <span className="text-xs text-[#7A9E87]">
                        {b.patientAge > 0 ? `${b.patientAge}y · ` : ''}{b.patientSex}
                      </span>
                      {b.clinicalFlags.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[#991B1B] bg-[#FEF2F2] px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {b.clinicalFlags.length} flag{b.clinicalFlags.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#3D6B50] truncate">
                      <span className="font-medium">CC:</span> {b.chiefComplaint}
                    </p>
                    <p className="text-xs text-[#7A9E87] mt-1.5 line-clamp-2">{b.hpi}</p>
                  </div>
                  <div className="ml-6 text-right shrink-0">
                    <div className="text-xs text-[#7A9E87] mb-1">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-[#7A9E87] mb-2">
                      {new Date(b.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                    <div className="flex gap-2 justify-end text-xs">
                      <span className="bg-[#E8F5EE] text-[#1B6B3A] px-2 py-0.5 rounded-full">
                        {b.oldcartsCount}/8 HPI
                      </span>
                      <span className="bg-[#E8F5EE] text-[#1B6B3A] px-2 py-0.5 rounded-full">
                        {b.rosCount}/6 ROS
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
