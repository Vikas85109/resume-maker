import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';
import TemplateSelection from '@/pages/TemplateSelection';
import ResumeEditor from '@/pages/ResumeEditor';
import AboutPage from '@/pages/AboutPage';
import PricingPage from '@/pages/PricingPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/templates" element={<TemplateSelection />} />
      <Route path="/editor" element={<ResumeEditor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};

export default App;
