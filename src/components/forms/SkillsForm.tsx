import React from 'react';
import TagInput from '@/components/ui/TagInput';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';

const SkillsForm: React.FC = () => {
  const { resumeData, updateSkills, updateLanguages, updateCertifications } = useResume();

  return (
    <Accordion title="Skills & More" badge={resumeData.skills.length}>
      <div className="space-y-4">
        <TagInput
          label="Skills"
          tags={resumeData.skills}
          onChange={updateSkills}
          placeholder="Add a skill..."
        />

        <TagInput
          label="Languages"
          tags={resumeData.languages}
          onChange={updateLanguages}
          placeholder="e.g. English (Native)"
        />

        <TagInput
          label="Certifications"
          tags={resumeData.certifications}
          onChange={updateCertifications}
          placeholder="e.g. AWS Certified"
        />
      </div>
    </Accordion>
  );
};

export default SkillsForm;
