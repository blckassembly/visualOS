import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { ProjectMetricsProvider } from './context/ProjectMetricsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ProjectMetricsProvider>
        <App />
      </ProjectMetricsProvider>
    </LanguageProvider>
  </StrictMode>,
);
