import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from '@/context/AppContext';
import { ResumeProvider } from '@/context/ResumeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </AppProvider>
  </React.StrictMode>
);
