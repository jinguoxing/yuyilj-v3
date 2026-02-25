import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SemanticLayout from './layouts/SemanticLayout';
import SemanticInbox from './pages/SemanticInbox';
import SemanticReleases from './pages/SemanticReleases';
import SemanticWorkbench from './pages/SemanticWorkbench';
import SemanticObjects from './pages/SemanticObjects';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/semantic/inbox" replace />} />
        <Route path="/semantic" element={<SemanticLayout />}>
          <Route path="inbox" element={<SemanticInbox />} />
          <Route path="releases" element={<SemanticReleases />} />
          <Route path="workbench" element={<SemanticWorkbench />} />
          <Route path="workbench/:lvId" element={<SemanticWorkbench />} />
          <Route path="objects/:lvId" element={<SemanticObjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
