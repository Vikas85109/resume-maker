import React from 'react';
import Input from '@/components/ui/Input';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';

const PersonalInfoForm: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo({ [field]: e.target.value });
  };

  return (
    <Accordion title="Personal Information" defaultOpen={true}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="John Smith"
            value={personalInfo.fullName}
            onChange={handleChange('fullName')}
          />
          <Input
            label="Job Title"
            placeholder="Software Engineer"
            value={personalInfo.jobTitle}
            onChange={handleChange('jobTitle')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={personalInfo.email}
            onChange={handleChange('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
          />
        </div>

        <Input
          label="Location"
          placeholder="San Francisco, CA"
          value={personalInfo.location}
          onChange={handleChange('location')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/yourprofile"
            value={personalInfo.linkedin}
            onChange={handleChange('linkedin')}
          />
          <Input
            label="Portfolio"
            placeholder="yourwebsite.com"
            value={personalInfo.portfolio}
            onChange={handleChange('portfolio')}
          />
        </div>
      </div>
    </Accordion>
  );
};

export default PersonalInfoForm;
