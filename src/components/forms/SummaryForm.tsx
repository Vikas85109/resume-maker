import React from 'react';
import TextArea from '@/components/ui/TextArea';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';

const SummaryForm: React.FC = () => {
  const { resumeData, updateSummary } = useResume();

  return (
    <Accordion title="Professional Summary">
      <TextArea
        placeholder="Write 2-3 sentences about your experience and goals..."
        value={resumeData.summary}
        onChange={(e) => updateSummary(e.target.value)}
        rows={3}
        charLimit={300}
      />
    </Accordion>
  );
};

export default SummaryForm;
