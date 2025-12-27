import React from 'react';
import TextArea from '@/components/ui/TextArea';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';

const SummaryForm: React.FC = () => {
  const { resumeData, updateSummary } = useResume();

  return (
    <Accordion
      title="Professional Summary"
      subtitle="A brief overview of your career"
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      }
    >
      <TextArea
        placeholder="Write a compelling summary that highlights your experience, skills, and career goals. Keep it concise and impactful (2-4 sentences)."
        value={resumeData.summary}
        onChange={(e) => updateSummary(e.target.value)}
        rows={4}
        charLimit={400}
        helperText="Tip: Start with your years of experience and key expertise"
      />
    </Accordion>
  );
};

export default SummaryForm;
