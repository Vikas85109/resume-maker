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
    <Accordion
      title="Personal Information"
      subtitle="Your contact details"
      defaultOpen={true}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="+1 (555) 123-4567"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/yourprofile"
            value={personalInfo.linkedin}
            onChange={handleChange('linkedin')}
          />
          <Input
            label="Portfolio / Website"
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
