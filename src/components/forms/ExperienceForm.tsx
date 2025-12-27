import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import { useResume } from '@/context/ResumeContext';
import { IExperience, generateId } from '@/types/resume';

const ExperienceForm: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExperience: IExperience = {
      id: generateId(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      responsibilities: [],
    };
    addExperience(newExperience);
    setExpandedId(newExperience.id);
  };

  const handleUpdateField = (id: string, field: keyof IExperience, value: unknown) => {
    updateExperience(id, { [field]: value });
  };

  const handleResponsibilitiesChange = (id: string, value: string) => {
    const responsibilities = value.split('\n').filter((line) => line.trim());
    updateExperience(id, { responsibilities });
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Accordion
      title="Work Experience"
      subtitle="Your professional history"
      badge={resumeData.experience.length}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        {resumeData.experience.map((exp) => (
          <div
            key={exp.id}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-slate-900">
                  {exp.role || 'Untitled Position'}
                </p>
                <p className="text-sm text-slate-500">
                  {exp.company || 'Company'}
                  {exp.startDate && ` • ${formatDate(exp.startDate)}`}
                  {exp.isCurrentRole ? ' - Present' : exp.endDate ? ` - ${formatDate(exp.endDate)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(exp.id);
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
                    expandedId === exp.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedId === exp.id && (
              <div className="p-4 space-y-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    placeholder="Software Engineer"
                    value={exp.role}
                    onChange={(e) => handleUpdateField(exp.id, 'role', e.target.value)}
                  />
                  <Input
                    label="Company"
                    placeholder="Google Inc."
                    value={exp.company}
                    onChange={(e) => handleUpdateField(exp.id, 'company', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateField(exp.id, 'startDate', e.target.value)}
                  />
                  <div>
                    <Input
                      label="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleUpdateField(exp.id, 'endDate', e.target.value)}
                      disabled={exp.isCurrentRole}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrentRole}
                        onChange={(e) => {
                          handleUpdateField(exp.id, 'isCurrentRole', e.target.checked);
                          if (e.target.checked) {
                            handleUpdateField(exp.id, 'endDate', '');
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">I currently work here</span>
                    </label>
                  </div>
                </div>

                <TextArea
                  label="Responsibilities & Achievements"
                  placeholder="• Led development of customer-facing features&#10;• Mentored junior developers&#10;• Improved performance by 40%"
                  value={exp.responsibilities.join('\n')}
                  onChange={(e) => handleResponsibilitiesChange(exp.id, e.target.value)}
                  rows={4}
                  helperText="Enter each point on a new line"
                />
              </div>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={handleAddExperience}
          className="w-full"
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Experience
        </Button>
      </div>
    </Accordion>
  );
};

export default ExperienceForm;
