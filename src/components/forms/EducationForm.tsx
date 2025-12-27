import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IEducation, generateId } from '@/types/resume';

const EducationForm: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddEducation = () => {
    const newEducation: IEducation = {
      id: generateId(),
      degree: '',
      institution: '',
      year: '',
      description: '',
    };
    addEducation(newEducation);
    setExpandedId(newEducation.id);
  };

  const handleUpdateField = (id: string, field: keyof IEducation, value: string) => {
    updateEducation(id, { [field]: value });
  };

  return (
    <Accordion
      title="Education"
      subtitle="Your academic background"
      badge={resumeData.education.length}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        {resumeData.education.map((edu) => (
          <div
            key={edu.id}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-slate-900">
                  {edu.degree || 'Untitled Degree'}
                </p>
                <p className="text-sm text-slate-500">
                  {edu.institution || 'Institution'}
                  {edu.year && ` • ${edu.year}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEducation(edu.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedId === edu.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === edu.id && (
              <div className="p-4 space-y-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree / Certification"
                    placeholder="B.S. Computer Science"
                    value={edu.degree}
                    onChange={(e) => handleUpdateField(edu.id, 'degree', e.target.value)}
                  />
                  <Input
                    label="Institution"
                    placeholder="Stanford University"
                    value={edu.institution}
                    onChange={(e) => handleUpdateField(edu.id, 'institution', e.target.value)}
                  />
                </div>

                <Input
                  label="Year"
                  placeholder="2020"
                  value={edu.year}
                  onChange={(e) => handleUpdateField(edu.id, 'year', e.target.value)}
                />

                <TextArea
                  label="Description (Optional)"
                  placeholder="Graduated with honors, GPA 3.8/4.0"
                  value={edu.description}
                  onChange={(e) => handleUpdateField(edu.id, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={handleAddEducation}
          className="w-full"
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Education
        </Button>
      </div>
    </Accordion>
  );
};

export default EducationForm;
