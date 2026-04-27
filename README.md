# ClinIntake — AI Clinical Intake Agent

Pre-visit clinical intake agent that conducts voice-based patient interviews and generates structured clinical briefs (CC, HPI, ROS, PMH).

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env
# Add your GROQ_API_KEY to .env
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Architecture

- State machine tracks 8 OLDCARTS fields + 6 ROS systems + PMH
- Separate LLM calls for: interviewer agent, patient simulator, data extractor, brief synthesizer
- Web Speech API for voice (Chrome/Edge required)
- jsPDF for client-side PDF generation

## Clinical Brief Output

CC → HPI (narrative) → ROS → PMH → Clinical Flags → Data Quality Notes
