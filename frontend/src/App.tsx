import { Routes, Route, Navigate } from 'react-router-dom';
import { SetupPage } from './pages/SetupPage';
import { InterviewPage } from './pages/InterviewPage';
import { BriefPage } from './pages/BriefPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SetupPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/brief" element={<BriefPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
