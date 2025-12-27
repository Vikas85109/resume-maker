import React from 'react';
import TagInput from '@/components/ui/TagInput';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';

const SkillsForm: React.FC = () => {
  const { resumeData, updateSkills, updateLanguages, updateCertifications } = useResume();

  return (
    <Accordion
      title="Skills & Languages"
      subtitle="Your technical and soft skills"
      badge={resumeData.skills.length + resumeData.languages.length}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      }
    >
      <div className="space-y-6">
        <TagInput
          label="Skills"
          tags={resumeData.skills}
          onChange={updateSkills}
          placeholder="Type a skill and press Enter"
        />

        <TagInput
          label="Languages"
          tags={resumeData.languages}
          onChange={updateLanguages}
          placeholder="e.g., English (Native), Spanish (Fluent)"
        />

        <TagInput
          label="Certifications"
          tags={resumeData.certifications}
          onChange={updateCertifications}
          placeholder="e.g., AWS Solutions Architect"
        />
      </div>
    </Accordion>
  );
};

export default SkillsForm;
