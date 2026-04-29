import { useNavigate } from 'react-router-dom';
import {
  Mic, FileText, Brain, Shield, ChevronRight,
  CheckCircle, Activity, Users, Stethoscope, AlertTriangle, ArrowRight
} from 'lucide-react';

const PATIENTS = [
  { initials: 'RK', name: 'Robert Kim', age: 54, cc: 'Chest pain', flags: 4, completion: 100 },
  { initials: 'AO', name: 'Amara Osei', age: 31, cc: 'Severe headache', flags: 4, completion: 100 },
  { initials: 'DW', name: 'Dorothy Walsh', age: 72, cc: 'Right knee pain', flags: 2, completion: 93 },
  { initials: 'JP', name: 'James Patel', age: 45, cc: 'Shortness of breath', flags: 4, completion: 100 },
  { initials: 'SR', name: 'Sofia Reyes', age: 28, cc: 'Abdominal pain', flags: 4, completion: 100 },
  { initials: 'HT', name: 'Harold Thompson', age: 67, cc: 'Fatigue & weight loss', flags: 5, completion: 93 },
];

const FEATURES = [
  {
    icon: Mic,
    title: 'Voice-First Interface',
    desc: 'Browser-native speech synthesis and recognition. Agent speaks, patient responds — no hardware required.',
  },
  {
    icon: Brain,
    title: 'Intelligent Questioning',
    desc: 'OLDCARTS + ROS structured protocol. One question per turn, probes vague answers, never repeats collected fields.',
  },
  {
    icon: FileText,
    title: 'Clinical Brief Generation',
    desc: 'CC, HPI narrative paragraph, full ROS, PMH, clinical flags and data quality notes — generated in seconds.',
  },
  {
    icon: Shield,
    title: 'Returning Patient Memory',
    desc: 'Recognises returning patients, references prior visits, confirms changes instead of starting from scratch.',
  },
  {
    icon: Users,
    title: 'Dual Role Dashboard',
    desc: 'Clinician dashboard shows all patient briefs with flags. Patient dashboard shows personal intake history.',
  },
  {
    icon: Activity,
    title: 'Real-Time Progress Tracking',
    desc: 'Live OLDCARTS and ROS completion tracker. Brief auto-generates when interview reaches closing phase.',
  },
];

const STEPS = [
  { number: '01', title: 'Select Patient Scenario', desc: 'Choose from 6 clinical presentations, each with a distinct personality and complete clinical truth.' },
  { number: '02', title: 'AI Conducts Interview', desc: 'RN Jordan guides the patient through a structured clinical intake — voice or chat, auto or manual mode.' },
  { number: '03', title: 'Brief Generated', desc: 'A structured clinical brief (CC → HPI → ROS → PMH → Flags) is auto-generated and saved to the doctor\'s dashboard.' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-[#C8E6D4]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-['Lora'] text-xl font-semibold text-[#0D2818]">ClinIntake</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-[#3D6B50] hover:text-[#1B6B3A] font-medium transition-colors px-4 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm bg-[#1B6B3A] hover:bg-[#0F4023] text-white font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#F0FAF4] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#1B6B3A] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Activity className="w-3.5 h-3.5" />
            AI-Powered Pre-Visit Clinical Intake
          </div>
          <h1 className="font-['Lora'] text-5xl md:text-6xl font-bold text-[#0D2818] leading-tight mb-6">
            Clinical intake that<br />
            <span className="text-[#1B6B3A]">thinks like a nurse</span>
          </h1>
          <p className="text-lg text-[#3D6B50] max-w-2xl mx-auto mb-10 leading-relaxed">
            ClinIntake conducts structured voice-based patient interviews, tracks OLDCARTS and ROS in real time,
            and generates a complete clinical brief — before the doctor walks in.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4023] text-white font-semibold rounded-xl px-7 py-3.5 text-base transition-colors"
            >
              Try it free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 border border-[#C8E6D4] hover:bg-[#F0FAF4] text-[#1B6B3A] font-semibold rounded-xl px-7 py-3.5 text-base transition-colors"
            >
              Sign in
            </button>
          </div>
          <p className="text-xs text-[#7A9E87] mt-4">No credit card required · Chrome / Edge required for voice</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#C8E6D4] bg-[#F0FAF4] py-8">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '6', label: 'Clinical Scenarios' },
            { value: '14', label: 'Data Fields Tracked' },
            { value: '< 30s', label: 'Brief Generation' },
            { value: '100%', label: 'Browser Native' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-['Lora'] text-3xl font-bold text-[#1B6B3A]">{value}</p>
              <p className="text-sm text-[#7A9E87] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Lora'] text-3xl font-bold text-[#0D2818] mb-3">How it works</h2>
            <p className="text-[#7A9E87]">Three steps from patient selection to clinical brief</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-['Lora'] font-bold text-[#C8E6D4] mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold text-[#0D2818] mb-2">{step.title}</h3>
                <p className="text-sm text-[#7A9E87] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient scenarios */}
      <section className="py-20 px-6 bg-[#F0FAF4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Lora'] text-3xl font-bold text-[#0D2818] mb-3">6 Clinical Scenarios</h2>
            <p className="text-[#7A9E87]">Each patient has a distinct personality, complete clinical truth, and real red flags</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PATIENTS.map((p) => (
              <div key={p.name} className="bg-white border border-[#C8E6D4] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#1B6B3A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {p.initials}
                  </div>
                  <div>
                    <p className="font-['Lora'] font-semibold text-[#0D2818] text-sm">{p.name}</p>
                    <p className="text-xs text-[#7A9E87]">{p.age}yo</p>
                  </div>
                </div>
                <span className="inline-block bg-[#E8F5EE] text-[#1B6B3A] text-xs font-medium px-2 py-0.5 rounded-full mb-2">
                  {p.cc}
                </span>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs text-[#991B1B]">
                    <AlertTriangle className="w-3 h-3" />
                    {p.flags} flags
                  </span>
                  <span className="text-xs text-[#7A9E87]">{p.completion}% coverage</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Lora'] text-3xl font-bold text-[#0D2818] mb-3">Built for clinical accuracy</h2>
            <p className="text-[#7A9E87]">Every design decision optimised for real clinical workflows</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-[#C8E6D4] rounded-xl p-5 hover:border-[#1B6B3A] transition-colors">
                <div className="w-10 h-10 bg-[#E8F5EE] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1B6B3A]" />
                </div>
                <h3 className="font-semibold text-[#0D2818] mb-2">{title}</h3>
                <p className="text-sm text-[#7A9E87] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief preview */}
      <section className="py-20 px-6 bg-[#F0FAF4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Lora'] text-3xl font-bold text-[#0D2818] mb-3">What the brief looks like</h2>
            <p className="text-[#7A9E87]">Structured, physician-ready — generated automatically at the end of each interview</p>
          </div>
          <div className="bg-white border border-[#C8E6D4] rounded-2xl overflow-hidden shadow-sm">
            {/* Brief header */}
            <div className="bg-[#1B6B3A] text-white px-6 py-4">
              <p className="text-xs text-green-300 uppercase tracking-wide mb-1">ClinIntake — Pre-Visit Clinical Brief · CONFIDENTIAL</p>
              <p className="font-['Lora'] text-xl font-semibold">Robert Kim, 54yo Male</p>
              <p className="text-sm text-green-200 mt-0.5">Generated 29 Apr 2026 · 22 interview turns</p>
            </div>
            <div className="p-6 space-y-5">
              {/* CC */}
              <div>
                <p className="text-xs font-semibold text-[#1B6B3A] uppercase tracking-wide mb-2">Chief Complaint</p>
                <div className="border-l-4 border-[#1B6B3A] pl-4 bg-[#F0FAF4] rounded-r-lg py-2 pr-3">
                  <p className="font-['Lora'] text-[#0D2818] italic">"chest pain and shortness of breath"</p>
                </div>
              </div>
              {/* HPI */}
              <div>
                <p className="text-xs font-semibold text-[#1B6B3A] uppercase tracking-wide mb-2">History of Present Illness</p>
                <p className="text-sm text-[#3D6B50] leading-relaxed font-['JetBrains_Mono']">
                  Mr. Kim is a 54-year-old male with a history of hypertension and T2DM presenting with a 4-day history of intermittent substernal chest pain rated 7/10 at peak, with a pressure and squeezing character, radiating to the left arm and jaw. Episodes last 5–10 minutes, occurring 3–4 times daily, precipitated by exertion and emotional stress, with one nocturnal episode. Diaphoresis and mild dyspnea on exertion are associated. Antacids provided no relief; rest partially alleviates.
                </p>
              </div>
              {/* ROS */}
              <div>
                <p className="text-xs font-semibold text-[#1B6B3A] uppercase tracking-wide mb-2">Review of Systems</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { sys: 'Constitutional', val: 'Fatigue, diaphoresis during episodes', pos: true },
                    { sys: 'Cardiovascular', val: 'Palpitations during episodes', pos: true },
                    { sys: 'Respiratory', val: 'Mild dyspnea on exertion', pos: true },
                    { sys: 'Gastrointestinal', val: 'Negative', pos: false },
                    { sys: 'Neurological', val: 'Negative', pos: false },
                    { sys: 'Musculoskeletal', val: 'Negative', pos: false },
                  ].map(({ sys, val, pos }) => (
                    <div key={sys} className="flex gap-2">
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pos ? 'text-[#1B6B3A]' : 'text-[#C8E6D4]'}`} />
                      <div>
                        <span className="text-xs font-medium text-[#0D2818]">{sys}: </span>
                        <span className={`text-xs ${pos ? 'text-[#3D6B50]' : 'text-[#7A9E87]'}`}>{val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Flags */}
              <div className="bg-[#FEF2F2] border border-red-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-[#991B1B] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Clinical Flags
                </p>
                <ul className="space-y-1">
                  {[
                    'Exertional chest pain with radiation to arm and jaw',
                    'Diaphoresis with episodes',
                    'Risk factors: HTN, DM, smoking, family history of MI',
                    'Nocturnal episode — possible ACS presentation',
                  ].map((flag) => (
                    <li key={flag} className="text-xs text-[#991B1B] flex gap-2">
                      <span>•</span>{flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Lora'] text-4xl font-bold text-[#0D2818] mb-4">
            Ready to try it?
          </h2>
          <p className="text-[#7A9E87] mb-8">
            Create an account, pick a patient scenario, and see a complete clinical brief generated in under 5 minutes.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4023] text-white font-semibold rounded-xl px-8 py-4 text-base transition-colors"
          >
            Get started free
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-[#7A9E87] mt-4">Chrome or Edge required · Web Speech API · Groq-powered</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C8E6D4] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1B6B3A] rounded flex items-center justify-center">
              <Stethoscope className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-['Lora'] text-sm font-semibold text-[#0D2818]">ClinIntake</span>
          </div>
          <p className="text-xs text-[#7A9E87]">
            Generated briefs are not a substitute for clinical judgment.
          </p>
          <div className="flex gap-4 text-xs text-[#7A9E87]">
            <button onClick={() => navigate('/login')} className="hover:text-[#1B6B3A] transition-colors">Sign in</button>
            <button onClick={() => navigate('/register')} className="hover:text-[#1B6B3A] transition-colors">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
